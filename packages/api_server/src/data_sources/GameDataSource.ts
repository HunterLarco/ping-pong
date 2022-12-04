import { GraphQLError } from 'graphql';
import DataLoader from 'dataloader';
import type { PrismaClient, Game, Player } from '@prisma/client';
import { IdentityType, PlayerState } from '@prisma/client';

import type MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import {
  sortByIdentity,
  selectIdentityCards,
} from '@/util/identityAssignments';

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

  async addPlayers(args: {
    gameId: string;
    userIds: Array<string>;
  }): Promise<{ newPlayers: Array<Player>; game: Game }> {
    const { gameId, userIds } = args;

    const game = await this.getById(gameId);
    if (!game) {
      throw new GraphQLError(`Game ${gameId} not found.`, {
        extensions: { code: 'NOT_FOUND' },
      });
    } else if (game.dateStarted) {
      throw new GraphQLError(`Game ${gameId} is already started.`, {
        extensions: { code: 'FAILED_PRECONDITION' },
      });
    } else if (game.players.length + userIds.length > 8) {
      throw new GraphQLError(
        `Game ${gameId} cannot accept ${userIds.length} more players.`,
        { extensions: { code: 'FAILED_PRECONDITION' } }
      );
    }

    const newPlayerUserIds = userIds.filter(
      (userId) => !game.players.find((player) => player.userId == userId)
    );
    if (!newPlayerUserIds.length) {
      return {
        newPlayers: [],
        game,
      };
    }

    const updatedGame = await this.#prismaClient.game.update({
      where: {
        id: gameId,
        cas: game.cas,
      },
      data: {
        players: { push: newPlayerUserIds.map((userId) => ({ userId })) },
        cas: { increment: 1 },
      },
    });

    const newPlayers = newPlayerUserIds.map((userId) => {
      const player = updatedGame.players.find(
        (player) => player.userId == userId
      );
      if (!player) {
        throw new GraphQLError(`Unexpectedly missing player ${userId}.`);
      }
      return player;
    });

    return {
      newPlayers,
      game: updatedGame,
    };
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
      throw new GraphQLError(`Game ${gameId} not found.`, {
        extensions: { code: 'NOT_FOUND' },
      });
    } else if (game.dateStarted) {
      throw new GraphQLError(`Game ${gameId} has already been started.`, {
        extensions: { code: 'FAILED_PRECONDITION' },
      });
    }

    const identityCards = await selectIdentityCards({
      count: game.players.length,
      cards: await identityDataSource.fetchAll(),
    });

    /// Update the game document in-process.

    for (const player of game.players) {
      const identityCard = identityCards.pop();
      if (!identityCard) {
        throw new GraphQLError(
          'Insufficient number of selected identity cards.'
        );
      }
      player.identityCard = identityCard;
      player.unveiled = identityCard.type == IdentityType.Leader;
    }

    /// Persist the modified game document.

    return this.#prismaClient.game.update({
      where: {
        id: game.id,
        cas: game.cas,
      },
      data: {
        dateStarted: new Date(),
        players: game.players,
        cas: { increment: 1 },
      },
    });
  }

  async unveil(args: {
    gameId: string;
    userId: string;
  }): Promise<Player | null> {
    const { gameId, userId } = args;

    const game = await this.#prismaClient.game.update({
      where: {
        id: gameId,
        players: {
          none: {
            userId,
            unveiled: true,
          },
        },
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

  async concede(args: {
    gameId: string;
    userId: string;
  }): Promise<Player | null> {
    const { gameId, userId } = args;

    const game = await this.getById(gameId);
    if (!game) {
      throw new GraphQLError(`Game ${gameId} not found`, {
        extensions: { code: 'NOT_FOUND' },
      });
    } else if (!game.dateStarted) {
      throw new GraphQLError(`Game ${gameId} has not been started.`, {
        extensions: { code: 'FAILED_PRECONDITION' },
      });
    }

    const player = game.players.find((player) => player.userId == userId);
    if (!player) {
      throw new GraphQLError(
        `User ${userId} is not a player in game ${gameId}`,
        { extensions: { code: 'FAILED_PRECONDITION' } }
      );
    } else if (player.state != PlayerState.Active) {
      throw new GraphQLError(
        `User ${userId} is not an active player in game ${gameId}.`,
        { extensions: { code: 'FAILED_PRECONDITION' } }
      );
    }

    /// Concede the target user.

    player.unveiled = true;
    player.state = PlayerState.Inactive;

    /// Check for any winners.

    const sortedPlayers = sortByIdentity(
      game.players,
      (player) => player.identityCard!.type
    );
    const isActive = (player: Player) => player.state == PlayerState.Active;
    const isInactive = (player: Player) => player.state == PlayerState.Inactive;
    const markWinner = (player: Player) => {
      player.unveiled = true;
      player.state = PlayerState.Won;
    };
    const markLoser = (player: Player) => {
      player.unveiled = true;
      player.state = PlayerState.Lost;
    };

    let gameEnded: boolean = false;
    if (sortedPlayers.leaders.every(isInactive)) {
      sortedPlayers.leaders.forEach(markLoser);
      sortedPlayers.guardians.forEach(markLoser);
      if (sortedPlayers.assassins.some(isActive)) {
        sortedPlayers.assassins.forEach(markWinner);
        sortedPlayers.traitors.forEach(markLoser);
        gameEnded = true;
      } else {
        sortedPlayers.assassins.forEach(markLoser);
        const aliveTraitors = sortedPlayers.traitors.filter(isActive);
        if (aliveTraitors.length == 1) {
          sortedPlayers.traitors.forEach(markLoser);
          markWinner(aliveTraitors[0]);
          gameEnded = true;
        }
      }
    } else if (
      sortedPlayers.assassins.every(isInactive) &&
      sortedPlayers.traitors.every(isInactive)
    ) {
      sortedPlayers.leaders.forEach(markWinner);
      sortedPlayers.guardians.forEach(markWinner);
      sortedPlayers.assassins.forEach(markLoser);
      sortedPlayers.traitors.forEach(markLoser);
      gameEnded = true;
    }

    const updatedGame = await this.#prismaClient.game.update({
      where: {
        id: game.id,
        cas: game.cas,
      },
      data: {
        players: game.players,
        dateEnded: gameEnded ? new Date() : null,
        cas: { increment: 1 },
      },
    });

    return (
      updatedGame.players.find((player) => player.userId == userId) || null
    );
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
