import type { PrismaClient } from '@prisma/client';

import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import { PrismaDataSource } from '@/data_sources/PrismaDataSource';

export function createContext(environment: { prismaClient: PrismaClient }) {
  return {
    dataSources: {
      Prisma: new PrismaDataSource(environment.prismaClient),
      MTGTreachery: new MTGTreacheryDataSource(),
    },
  };
}
