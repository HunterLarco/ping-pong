import type { PrismaClient } from '@prisma/client';

import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import { PrismaDataSource } from '@/data_sources/PrismaDataSource';
import AuthTokenDataSource from '@/data_sources/AuthTokenDataSource';

export type RequestContext = {
  dataSources: {
    Prisma: PrismaDataSource;
    AuthToken: AuthTokenDataSource;
    MTGTreachery: MTGTreacheryDataSource;
  };
};

export function createContext(environment: {
  prismaClient: PrismaClient;
}): RequestContext {
  return {
    dataSources: {
      Prisma: new PrismaDataSource(environment.prismaClient),
      AuthToken: new AuthTokenDataSource(environment.prismaClient),
      MTGTreachery: new MTGTreacheryDataSource(),
    },
  };
}
