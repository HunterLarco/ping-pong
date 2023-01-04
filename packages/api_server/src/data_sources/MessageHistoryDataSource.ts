import type { MessageHistory, PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { GraphQLError } from 'graphql';

export default class MessageHistoryDataSource {
  #prismaClient: PrismaClient;

  constructor(args: { prismaClient: PrismaClient }) {
    const { prismaClient } = args;
    this.#prismaClient = prismaClient;
  }

  async recordMessage(args: { message: string }): Promise<MessageHistory> {
    return await this.#prismaClient.messageHistory.create({
      data: {
        message: args.message,
      },
    });
  }

  async getAllHistory(): Promise<Array<MessageHistory>> {
    return this.#prismaClient.messageHistory.findMany({
      orderBy: {
        dateCreated: 'desc',
      },
    });
  }

  async getByIdOrThrow(id: string): Promise<MessageHistory> {
    const messageHistory = await this.getById(id);
    if (!messageHistory) {
      throw new GraphQLError(`MessageHistory ${id} not found.`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return messageHistory;
  }

  async getById(id: string): Promise<MessageHistory | null> {
    const messageHistory = await this.#batchGetById.load(id);
    return messageHistory || null;
  }

  #batchGetById = new DataLoader(async (ids: Readonly<Array<string>>) => {
    const messageHistorys = await this.#prismaClient.messageHistory.findMany({
      where: {
        OR: ids.map((id) => ({ id })),
      },
    });

    // We need to ensure that the returned messageHistorys are in the same exact
    // order as the searched id's to fulfill the DataLoader contract:

    const messageHistoryMap = new Map<string, MessageHistory>();
    for (const messageHistory of messageHistorys) {
      messageHistoryMap.set(messageHistory.id, messageHistory);
    }

    return ids.map((id) =>
      messageHistoryMap.has(id) ? messageHistoryMap.get(id) : null
    );
  });
}
