import DataLoader from 'dataloader';
import {
  PrismaClient,
  AuthToken,
  AuthScope,
  AuthScopeCode,
} from '@prisma/client';

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
    const tokens = await this.#prismaClient.authToken.findMany({
      where: {
        AND: ids.map((id) => ({ id })),
      },
    });

    // We need to ensure that the returned tokens are in the same exact order as
    // the searched id's to fulfill the DataLoader contract:

    const tokenMap = new Map<string, AuthToken>();
    for (const token of tokens) {
      tokenMap.set(token.id, token);
    }

    return ids.map((id) => (tokenMap.has(id) ? tokenMap.get(id) : null));
  });
}
