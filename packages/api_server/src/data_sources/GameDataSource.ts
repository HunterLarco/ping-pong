import DataLoader from 'dataloader';
import type { PrismaClient, Game, Player } from '@prisma/client';
import { IdentityType } from '@prisma/client';

import type MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import { selectIdentityCards } from '@/util/identityAssignments';

export default class GameDataSource {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  async createGame() {
    return await this.#prismaClient.game.create({
      data: {},
    });
  }

  async addPlayer(args: { gameId: string; userId: string }): Promise<Boolean> {
    const { gameId, userId } = args;

    const game = await this.getById(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found.`);
    } else if (game.players.find((player) => player.userId == userId)) {
      console.info(`User ${userId} is already part of game ${gameId}.`);
      return true;
    } else if (game.players.length >= 8) {
      throw new Error(`Game ${gameId} cannot accept more players.`);
    }

    await this.#prismaClient.game.updateMany({
      where: {
        id: gameId,
        cas: game.cas,
      },
      data: {
        players: { push: [{ userId }] },
        cas: { increment: 1 },
      },
    });

    return false;
  }

  async getCurrentGame(args: { playerId: string }): Promise<Game | null> {
    const { playerId } = args;

    return await this.#prismaClient.game.findFirst({
      where: {
        players: {
          some: {
            userId: playerId,
          },
        },
        dateEnded: {
          isSet: false,
        },
      },
      orderBy: {
        dateCreated: 'desc',
      },
    });
  }

  async startGame(args: {
    gameId: string;
    identityDataSource: MTGTreacheryDataSource;
  }): Promise<Game> {
    const { gameId, identityDataSource } = args;

    const game = await this.getById(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found.`);
    } else if (game.dateStarted) {
      throw new Error(`Game ${gameId} has already been started.`);
    }

    const identityCards = await selectIdentityCards({
      count: game.players.length,
      cards: await identityDataSource.fetchAll(),
    });

    /// Update the game document in-process.

    game.dateStarted = new Date();
    for (const player of game.players) {
      const identityCard = identityCards.pop();
      if (!identityCard) {
        throw new Error('Insufficient number of selected identity cards.');
      }
      player.identityCard = identityCard;
      player.unveiled = identityCard.type == IdentityType.Leader;
    }

    /// Persist the modified game document.

    const now = new Date();
    await this.#prismaClient.game.updateMany({
      where: {
        id: game.id,
        cas: game.cas,
      },
      data: {
        dateStarted: game.dateStarted,
        players: game.players,
        cas: { increment: 1 },
      },
    });

    return game;
  }

  async unveil(args: {
    gameId: string;
    userId: string;
  }): Promise<Player | null> {
    const { gameId, userId } = args;

    const game = await this.#prismaClient.game.update({
      where: {
        id: gameId,
      },
      data: {
        players: {
          updateMany: {
            where: {
              userId,
            },
            data: {
              unveiled: true,
            },
          },
        },
      },
    });

    return game.players.find((player) => player.userId == userId) || null;
  }

  async getById(id: string): Promise<Game | null> {
    const game = await this.#batchGetById.load(id);
    return game || null;
  }

  #batchGetById = new DataLoader(async (ids: Readonly<Array<string>>) => {
    const games = await this.#prismaClient.game.findMany({
      where: {
        OR: ids.map((id) => ({ id })),
      },
    });

    // We need to ensure that the returned games are in the same exact order as
    // the searched id's to fulfill the DataLoader contract:

    const gameMap = new Map<string, Game>();
    for (const game of games) {
      gameMap.set(game.id, game);
    }

    return ids.map((id) => (gameMap.has(id) ? gameMap.get(id) : null));
  });
}

function orcleToPrismaIdentityType(identityType: string): IdentityType {
  switch (identityType.toLowerCase()) {
    case 'leader':
      return IdentityType.Leader;
    case 'guardian':
      return IdentityType.Guardian;
    case 'assassin':
      return IdentityType.Assassin;
    case 'traitor':
      return IdentityType.Traitor;
  }
  throw new Error(`Unknown identity subtype ${identityType}.`);
}
