import DataLoader from 'dataloader';
import type { PrismaClient, User } from '@prisma/client';

export default class UserDataSource {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  async createUser(args: { phoneNumber: string; name: string }): Promise<User> {
    return await this.#prismaClient.user.create({
      data: {
        phoneNumber: args.phoneNumber,
        name: args.name,
      },
    });
  }

  async getByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const user = await this.#batchGetByPhoneNumber.load(phoneNumber);
    return user || null;
  }

  #batchGetByPhoneNumber = new DataLoader(
    async (phoneNumbers: Readonly<Array<string>>) => {
      const tokens = await this.#prismaClient.user.findMany({
        where: {
          AND: phoneNumbers.map((phoneNumber) => ({ phoneNumber })),
        },
      });

      // We need to ensure that the returned tokens are in the same exact order
      // as the searched phoneNumber's to fulfill the DataLoader contract:

      const tokenMap = new Map<string, User>();
      for (const token of tokens) {
        tokenMap.set(token.phoneNumber, token);
      }

      return phoneNumbers.map((phoneNumber) =>
        tokenMap.has(phoneNumber) ? tokenMap.get(phoneNumber) : null
      );
    }
  );

  async getById(id: string): Promise<User | null> {
    const user = await this.#batchGetById.load(id);
    return user || null;
  }

  #batchGetById = new DataLoader(async (ids: Readonly<Array<string>>) => {
    const tokens = await this.#prismaClient.user.findMany({
      where: {
        AND: ids.map((id) => ({ id })),
      },
    });

    // We need to ensure that the returned tokens are in the same exact order as
    // the searched id's to fulfill the DataLoader contract:

    const tokenMap = new Map<string, User>();
    for (const token of tokens) {
      tokenMap.set(token.id, token);
    }

    return ids.map((id) => (tokenMap.has(id) ? tokenMap.get(id) : null));
  });
}
