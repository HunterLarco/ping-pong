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
      remainingUses: 1,
    });
  }

  async createAuthToken(args: {
    scopes: Array<AuthScope>;
    expiry?: Date;
    remainingUses?: number;
  }): Promise<AuthToken> {
    return await this.#prismaClient.authToken.create({
      data: {
        scopes: args.scopes,
        expiry: args.expiry,
        remainingUses: args.remainingUses,
      },
    });
  }

  async use(args: {
    id: string;
    requiredScopeCodes: Array<AuthScopeCode>;
  }): Promise<Array<string>> {
    const { id, requiredScopeCodes } = args;

    const token = await this.#prismaClient.authToken.update({
      where: {
        id,
      },
      data: {
        remainingUses: {
          decrement: 1,
        },
      },
    });

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
    } else if (token.remainingUses !== null && token.remainingUses < 0) {
      deleteToken();
      throw `Token ${id} has no remaining uses.`;
    } else if (token.remainingUses !== null && token.remainingUses == 0) {
      deleteToken();
    }

    const targetsByCode = new Map<AuthScopeCode, string>();
    for (const scope of token.scopes) {
      targetsByCode.set(scope.code, scope.target);
    }

    return requiredScopeCodes.map((scopeCode) => {
      const target = targetsByCode.get(scopeCode);
      if (target === undefined) {
        throw new Error(`Token ${id} is missing code ${scopeCode}.`);
      }
      return target;
    });
  }
}
