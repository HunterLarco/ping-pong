import { User, Game, AuthScopeCode } from '@prisma/client';

import type { GlobalContext } from '@/GlobalContext';
import AuthTokenDataSource from '@/data_sources/AuthTokenDataSource';
import GameDataSource from '@/data_sources/GameDataSource';
import GameEventPubSub from '@/data_sources/GameEventPubSub';
import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import UserDataSource from '@/data_sources/UserDataSource';

type DataSources = {
  AuthToken: AuthTokenDataSource;
  Game: GameDataSource;
  GameEvent: GameEventPubSub;
  MTGTreachery: MTGTreacheryDataSource;
  User: UserDataSource;
};

export type RequestContext = {
  actor: User | null;
  hostedGame: Game | null;
  dataSources: DataSources;
  globalContext: GlobalContext;
};

export async function createRequestContext(args: {
  globalContext: GlobalContext;
  authorization: string | null;
}): Promise<RequestContext> {
  const { globalContext, authorization } = args;

  const MTGTreachery = new MTGTreacheryDataSource();
  const dataSources: DataSources = {
    AuthToken: new AuthTokenDataSource({ prismaClient: globalContext.prisma }),
    Game: new GameDataSource({
      prismaClient: globalContext.prisma,
      identityDataSource: MTGTreachery,
    }),
    GameEvent: new GameEventPubSub(),
    MTGTreachery,
    User: new UserDataSource({ prismaClient: globalContext.prisma }),
  };

  return {
    actor: await getActor(dataSources, authorization),
    hostedGame: await getHostedGame(dataSources, authorization),
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

async function getHostedGame(
  dataSources: DataSources,
  authorization: string | null
): Promise<Game | null> {
  if (!authorization) {
    return null;
  }

  try {
    const [gameId] = await dataSources.AuthToken.use({
      id: authorization,
      requiredScopeCodes: [AuthScopeCode.GameHost],
    });

    return await dataSources.Game.getById(gameId);
  } catch {
    return null;
  }
}
