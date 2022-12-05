import { GraphQLError } from 'graphql';
import DataLoader from 'dataloader';
import type { PrismaClient, User } from '@prisma/client';

export default class UserDataSource {
  #prismaClient: PrismaClient;

  constructor(args: { prismaClient: PrismaClient }) {
    const { prismaClient } = args;
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
          OR: phoneNumbers.map((phoneNumber) => ({ phoneNumber })),
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

  async getByIdOrThrow(id: string): Promise<User> {
    const user = await this.getById(id);
    if (!user) {
      throw new GraphQLError(`User ${id} not found.`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return user;
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.#batchGetById.load(id);
    return user || null;
  }

  #batchGetById = new DataLoader(async (ids: Readonly<Array<string>>) => {
    const users = await this.#prismaClient.user.findMany({
      where: {
        OR: ids.map((id) => ({ id })),
      },
    });

    // We need to ensure that the returned users are in the same exact order as
    // the searched id's to fulfill the DataLoader contract:

    const userMap = new Map<string, User>();
    for (const user of users) {
      userMap.set(user.id, user);
    }

    return ids.map((id) => (userMap.has(id) ? userMap.get(id) : null));
  });
}
