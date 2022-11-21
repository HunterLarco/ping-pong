import { PrismaClient } from '@prisma/client';

const kDuration_Days = 24 * 60 * 60 * 1000;

export async function initiatePrismaClient() {
  const prisma = new PrismaClient();
  await prisma.$connect();
  return prisma;
}

export class PrismaDataSource {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  async createGame() {
    return await this.#prismaClient.game.create({
      data: {},
    });
  }

  async createTemporaryUser(options: { name: string }) {
    return await this.#prismaClient.temporaryUser.create({
      data: {
        name: options.name,
        dateExpires: new Date(Date.now() + kDuration_Days * 7),
      },
    });
  }

  async joinGame(options: { gameId: string; temporaryUserId: string }) {
    await this.#prismaClient.game.update({
      where: {
        id: options.gameId,
      },
      data: {
        playerIds: {
          push: [options.temporaryUserId],
        },
      },
    });
  }
}
