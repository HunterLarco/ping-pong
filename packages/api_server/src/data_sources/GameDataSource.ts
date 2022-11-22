import DataLoader from 'dataloader';
import type { PrismaClient, Game } from '@prisma/client';

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

  async addPlayer(args: { gameId: string; userId: string }) {
    const { gameId, userId } = args;

    const game = await this.getById(gameId);
    if (!game) {
      throw new Error(`Game ${gameId} not found.`);
    } else if (game.playerIds.indexOf(userId) >= 0) {
      // The player is already part of the game. This early exit doesn't avoid
      // all race conditions, it's still possible to get duplicates in the
      // `playerIds` field, but at least this helps reduce the chance.
      return;
    }

    await this.#prismaClient.game.update({
      where: {
        id: gameId,
      },
      data: {
        playerIds: {
          push: [userId],
        },
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
        AND: ids.map((id) => ({ id })),
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
