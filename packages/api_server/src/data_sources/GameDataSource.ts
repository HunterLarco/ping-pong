import DataLoader from 'dataloader';
import type { PrismaClient, Game } from '@prisma/client';
import { IdentityType } from '@prisma/client';

import type MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import { assignIdentityCards } from '@/util/identityAssignments';

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
    } else if (game.playerIds.indexOf(userId) >= 0) {
      // The player is already part of the game.
      return true;
    } else if (game.playerIds.length >= 8) {
      throw new Error(`Game ${gameId} cannot accept more players.`);
    }

    await this.#prismaClient.game.updateMany({
      where: {
        id: gameId,
        cas: game.cas,
      },
      data: {
        playerIds: { push: [userId] },
        cas: { increment: 1 },
      },
    });

    return false;
  }

  async getCurrentGame(args: { playerId: string }): Promise<Game | null> {
    const { playerId } = args;

    return await this.#prismaClient.game.findFirst({
      where: {
        playerIds: {
          has: playerId,
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

    const identityAssignments = [];
    for await (const { playerId, identity } of assignIdentityCards({
      playerIds: game.playerIds,
      identityDataSource,
    })) {
      identityAssignments.push({
        playerId,
        identityCard: identity,
      });
    }

    const now = new Date();
    await this.#prismaClient.game.updateMany({
      where: {
        id: gameId,
        cas: game.cas,
      },
      data: {
        dateStarted: now,
        identityAssignments,
        cas: { increment: 1 },
      },
    });

    return {
      ...game,
      dateStarted: now,
      identityAssignments,
      cas: game.cas + 1,
    };
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
