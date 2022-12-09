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
  #identityDataSource: MTGTreacheryDataSource;

  constructor(args: {
    prismaClient: PrismaClient;
    identityDataSource: MTGTreacheryDataSource;
  }) {
    const { prismaClient, identityDataSource } = args;

    this.#prismaClient = prismaClient;
    this.#identityDataSource = identityDataSource;
  }

  async createGame(): Promise<Game> {
    return await this.#prismaClient.game.create({
      data: {},
    });
  }

  async addPlayers(args: {
    gameId: string;
    userIds: Array<string>;
  }): Promise<{ game: Game; newPlayers: Array<Player> }> {
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

    const existingUserIds = new Set(
      game.players.map((player) => player.userId)
    );
    const userIdsToAdd = userIds.filter(
      (userId) => !existingUserIds.has(userId)
    );

    if (!userIdsToAdd) {
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
        players: { push: userIdsToAdd.map((userId) => ({ userId })) },
        cas: { increment: 1 },
      },
    });

    return {
      newPlayers: updatedGame.players.filter(
        (player) => !existingUserIds.has(player.userId)
      ),
      game: updatedGame,
    };
  }

  async startGame(args: { gameId: string }): Promise<Game> {
    const { gameId } = args;

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
      cards: await this.#identityDataSource.fetchAll(),
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
  }): Promise<{ game: Game; player: Player }> {
    const { gameId, userId } = args;

    // Even though we don't actually need to fetch the game document and instead
    // prefer to use an atomic update, it's still nice to run optimistic
    // validation for better error messages when things fail (e.g. user isn't a
    // player in the game).
    const { player } = await this.#validateActivePlayer({ gameId, userId });
    if (player.unveiled) {
      throw new GraphQLError(`User ${userId} is already unveiled.`, {
        extensions: { code: 'FAILED_PRECONDITION' },
      });
    }

    const game = await this.#prismaClient.game.update({
      where: {
        id: gameId,
        players: {
          some: {
            userId,
            unveiled: false,
            state: PlayerState.Active,
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

    return {
      game,
      player: game.players.find((player) => player.userId == userId)!,
    };
  }

  /**
   * Because conceding can have impact on other players: e.g. if the leader
   * concedes the game ends. This method returns both the updated game state and
   * a list of players impacted by the concession.
   */
  async concede(args: {
    gameId: string;
    userId: string;
  }): Promise<{ game: Game; modifiedPlayers: Array<Player> }> {
    const { gameId, userId } = args;

    const { game, player } = await this.#validateActivePlayer({
      gameId,
      userId,
    });
    const modifiedPlayerIds = new Set<string>();

    /// Concede the target user.

    player.unveiled = true;
    player.state = PlayerState.Inactive;
    modifiedPlayerIds.add(player.userId);

    /// Evaluate win conditions
    ///
    /// This includes both checking if they game ended as well as promoting
    /// inactive players to players who lost if their team can no longer win.
    /// For example, assasins are marked as inactive until all assassins are
    /// inactive, at which point they're all marked as losers.

    const sortedPlayers = sortByIdentity(
      game.players,
      (player) => player.identityCard!.type
    );
    const isActive = (player: Player) => player.state == PlayerState.Active;
    const isInactive = (player: Player) => player.state == PlayerState.Inactive;
    const hasLost = (player: Player) => player.state == PlayerState.Lost;

    const markWinner = (player: Player) => {
      player.unveiled = true;
      player.state = PlayerState.Won;
      modifiedPlayerIds.add(player.userId);
    };
    const markLoser = (player: Player) => {
      player.unveiled = true;
      player.state = PlayerState.Lost;
      modifiedPlayerIds.add(player.userId);
    };

    // Promote from Inactive -> Lost

    for (const leader of sortedPlayers.leaders) {
      if (leader.state == PlayerState.Inactive) {
        markLoser(leader);
      }
    }
    if (sortedPlayers.leaders.every(hasLost)) {
      sortedPlayers.guardians.forEach(markLoser);
    }
    if (sortedPlayers.assassins.every(isInactive)) {
      sortedPlayers.assassins.forEach(markLoser);
    }
    for (const traitor of sortedPlayers.traitors) {
      if (traitor.state == PlayerState.Inactive) {
        markLoser(traitor);
      }
    }

    // Check for winners

    let gameEnded: boolean = false;
    if (sortedPlayers.leaders.every(hasLost)) {
      if (sortedPlayers.assassins.some(isActive)) {
        sortedPlayers.assassins.forEach(markWinner);
        sortedPlayers.traitors.forEach(markLoser);
        gameEnded = true;
      } else {
        const aliveTraitors = sortedPlayers.traitors.filter(isActive);
        if (aliveTraitors.length == 1) {
          sortedPlayers.traitors.forEach(markLoser);
          markWinner(aliveTraitors[0]);
          gameEnded = true;
        }
      }
    } else if (
      sortedPlayers.assassins.every(hasLost) &&
      sortedPlayers.traitors.every(hasLost)
    ) {
      sortedPlayers.leaders.forEach(markWinner);
      sortedPlayers.guardians.forEach(markWinner);
      gameEnded = true;
    }

    /// Persist the new game state.

    const updatedGame = await this.#prismaClient.game.update({
      where: {
        id: game.id,
        cas: game.cas,
      },
      data: {
        players: game.players,
        dateEnded: gameEnded ? new Date() : undefined,
        cas: { increment: 1 },
      },
    });

    return {
      game: updatedGame,
      modifiedPlayers: updatedGame.players.filter((player) =>
        modifiedPlayerIds.has(player.userId)
      ),
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

  async #validateActivePlayer(args: {
    gameId: string;
    userId: string;
  }): Promise<{ game: Game; player: Player }> {
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
    } else if (game.dateEnded) {
      throw new GraphQLError(`Game ${gameId} has ended.`, {
        extensions: { code: 'FORBIDDEN' },
      });
    }

    const player = game.players.find((player) => player.userId == userId);
    if (!player) {
      throw new GraphQLError(
        `User ${userId} is not a player in game ${gameId}`,
        { extensions: { code: 'FORBIDDEN' } }
      );
    } else if (player.state != PlayerState.Active) {
      throw new GraphQLError(
        `User ${userId} is not an active player in game ${gameId}.`,
        { extensions: { code: 'FAILED_PRECONDITION' } }
      );
    }

    return { game, player };
  }
}
