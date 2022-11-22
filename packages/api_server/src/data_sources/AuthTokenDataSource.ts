import DataLoader from 'dataloader';
import { PrismaClient, AuthScope, AuthScopeCode } from '@prisma/client';

type createAuthTokenArgs = {
  scopes: Array<AuthScope>;
};

export default class AuthTokenDataSource {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  async createTemporaryUserAuthToken(temporaryUserId: string) {
    return await this.createAuthToken({
      scopes: [
        {
          code: AuthScopeCode.TemporaryUserAuth,
          target: temporaryUserId,
        },
      ],
    });
  }

  async createAuthToken(args: createAuthTokenArgs) {
    return await this.#prismaClient.authToken.create({
      data: { scopes: args.scopes },
    });
  }

  async getById(id: string) {
    return this.#batchGetById.load(id);
  }

  #batchGetById = new DataLoader(async (ids: Readonly<Array<string>>) => {
    return this.#prismaClient.authToken.findMany({
      where: {
        AND: ids.map((id) => ({ id })),
      },
    });
  });
}
