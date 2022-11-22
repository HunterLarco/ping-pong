import { User, AuthScopeCode } from '@prisma/client';

import type { GlobalContext } from '@/GlobalContext';
import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import GameDataSource from '@/data_sources/GameDataSource';
import AuthTokenDataSource from '@/data_sources/AuthTokenDataSource';
import UserDataSource from '@/data_sources/UserDataSource';

type DataSources = {
  Game: GameDataSource;
  AuthToken: AuthTokenDataSource;
  User: UserDataSource;
  MTGTreachery: MTGTreacheryDataSource;
};

export type RequestContext = {
  actor: User | null;
  dataSources: DataSources;
  globalContext: GlobalContext;
};

export async function createRequestContext(args: {
  globalContext: GlobalContext;
  authorization: string | null;
}): Promise<RequestContext> {
  const { globalContext, authorization } = args;

  const dataSources: DataSources = {
    Game: new GameDataSource(globalContext.prisma),
    AuthToken: new AuthTokenDataSource(globalContext.prisma),
    User: new UserDataSource(globalContext.prisma),
    MTGTreachery: new MTGTreacheryDataSource(),
  };

  return {
    actor: await getActor(dataSources, authorization),
    dataSources,
    globalContext,
  };
}

async function getActor(
  dataSources: DataSources,
  authorization: string | null
): Promise<User | null> {
  if (!authorization) {
    return null;
  }

  try {
    const [userId] = await dataSources.AuthToken.use({
      id: authorization,
      requiredScopeCodes: [AuthScopeCode.UserAuth],
    });

    return await dataSources.User.getById(userId);
  } catch {
    return null;
  }
}
