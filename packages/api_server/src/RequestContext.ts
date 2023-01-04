import type { GlobalContext } from '@/GlobalContext';
import MessageHistoryDataSource from '@/data_sources/MessageHistoryDataSource';

type DataSources = {
  MessageHistory: MessageHistoryDataSource;
};

export type RequestContext = {
  actor: null;
  dataSources: DataSources;
  globalContext: GlobalContext;
};

export async function createRequestContext(args: {
  globalContext: GlobalContext;
  authorization: string | null;
}): Promise<RequestContext> {
  const { globalContext, authorization } = args;

  const dataSources: DataSources = {
    MessageHistory: new MessageHistoryDataSource({
      prismaClient: globalContext.prisma,
    }),
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
): Promise<null> {
  // Any user auth would occur here.
  return null;
}
