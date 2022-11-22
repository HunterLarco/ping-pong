import DataLoader from 'dataloader';
import { PrismaClient, TemporaryUser } from '@prisma/client';

const kDuration_Days = 24 * 60 * 60 * 1000;

export default class TemporaryUserDataSource {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  async createTemporaryUser(args: { name: string }): Promise<TemporaryUser> {
    return await this.#prismaClient.temporaryUser.create({
      data: {
        name: args.name,
        dateExpires: new Date(Date.now() + kDuration_Days * 7),
      },
    });
  }

  async getById(id: string): Promise<TemporaryUser | null> {
    const user = await this.#batchGetById.load(id);
    return user || null;
  }

  #batchGetById = new DataLoader(async (ids: Readonly<Array<string>>) => {
    const tokens = await this.#prismaClient.temporaryUser.findMany({
      where: {
        AND: ids.map((id) => ({ id })),
      },
    });

    // We need to ensure that the returned tokens are in the same exact order as
    // the searched id's to fulfill the DataLoader contract:

    const tokenMap = new Map<string, TemporaryUser>();
    for (const token of tokens) {
      tokenMap.set(token.id, token);
    }

    return ids.map((id) => (tokenMap.has(id) ? tokenMap.get(id) : null));
  });
}
