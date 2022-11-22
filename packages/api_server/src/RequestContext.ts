import { TemporaryUser, AuthScopeCode } from '@prisma/client';

import type { GlobalContext } from '@/GlobalContext';
import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import GameDataSource from '@/data_sources/GameDataSource';
import AuthTokenDataSource from '@/data_sources/AuthTokenDataSource';
import TemporaryUserDataSource from '@/data_sources/TemporaryUserDataSource';

type DataSources = {
  Game: GameDataSource;
  AuthToken: AuthTokenDataSource;
  TemporaryUser: TemporaryUserDataSource;
  MTGTreachery: MTGTreacheryDataSource;
};

export type RequestContext = {
  actor: TemporaryUser | null;
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
    TemporaryUser: new TemporaryUserDataSource(globalContext.prisma),
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
): Promise<TemporaryUser | null> {
  if (!authorization) {
    return null;
  }

  const authToken = await dataSources.AuthToken.getById(authorization);
  if (!authToken) {
    return null;
  }

  for (const scope of authToken.scopes) {
    switch (scope.code) {
      case AuthScopeCode.TemporaryUserAuth:
        return await dataSources.TemporaryUser.getById(scope.target);
    }
  }

  return null;
}
