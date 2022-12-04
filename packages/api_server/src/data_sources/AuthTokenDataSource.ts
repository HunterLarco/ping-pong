import { GraphQLError } from 'graphql';
import DataLoader from 'dataloader';
import {
  PrismaClient,
  AuthToken,
  AuthScope,
  AuthScopeCode,
} from '@prisma/client';

export default class AuthTokenDataSource {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }

  async createUserAuthToken(temporaryUserId: string) {
    return await this.createAuthToken({
      scopes: [
        {
          code: AuthScopeCode.UserAuth,
          target: temporaryUserId,
        },
      ],
    });
  }

  async createPhoneVerificationToken(phoneNumber: string) {
    return await this.createAuthToken({
      scopes: [
        {
          code: AuthScopeCode.PhoneVerification,
          target: phoneNumber,
        },
      ],
    });
  }

  async createGameHostAuthToken(gameId: string) {
    return await this.createAuthToken({
      scopes: [
        {
          code: AuthScopeCode.GameHost,
          target: gameId,
        },
      ],
    });
  }

  async createAuthToken(args: {
    scopes: Array<AuthScope>;
    expiry?: Date;
  }): Promise<AuthToken> {
    return await this.#prismaClient.authToken.create({
      data: {
        scopes: args.scopes,
        expiry: args.expiry,
      },
    });
  }

  async use(args: {
    id: string;
    requiredScopeCodes: Array<AuthScopeCode>;
  }): Promise<Array<string>> {
    const { id, requiredScopeCodes } = args;

    const token = await this.#batchGetById.load(id);
    if (!token) {
      throw `Token ${id} not found.`;
    }

    const deleteToken = () => {
      this.#prismaClient.authToken
        .delete({
          where: { id },
        })
        .catch((error) => {
          console.error('Unexpected error:', error);
        });
    };

    if (token.expiry !== null && token.expiry < new Date()) {
      deleteToken();
      throw `Token ${id} has expired.`;
    }

    const targetsByCode = new Map<AuthScopeCode, string>();
    for (const scope of token.scopes) {
      targetsByCode.set(scope.code, scope.target);
    }

    return requiredScopeCodes.map((scopeCode) => {
      const target = targetsByCode.get(scopeCode);
      if (target === undefined) {
        throw new GraphQLError(`Token ${id} is missing code ${scopeCode}.`, {
          extensions: { code: 'FORBIDDEN' },
        });
      }
      return target;
    });
  }

  #batchGetById = new DataLoader(
    async (ids: Readonly<Array<string>>): Promise<Array<AuthToken | null>> => {
      const tokens = await this.#prismaClient.authToken.findMany({
        where: {
          OR: ids.map((id) => ({ id })),
        },
      });

      // We need to ensure that the returned tokens are in the same exact order
      // as the searched id's to fulfill the DataLoader contract:

      const tokenMap = new Map<string, AuthToken>();
      for (const token of tokens) {
        tokenMap.set(token.id, token);
      }

      return ids.map((id) => {
        const token = tokenMap.get(id);
        return token || null;
      });
    }
  );
}
