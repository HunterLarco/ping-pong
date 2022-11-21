import type { PrismaClient } from '@prisma/client'

import MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import { PrismaDataSource } from '@/data_sources/PrismaDataSource';

export function createContext(environment: { prismaClient: PrismaClient }) {
  return {
    dataSources: {
      PrismaDataSource: new PrismaDataSource(environment.prismaClient),
      MTGTreachery: new MTGTreacheryDataSource(),
    },
  };
}
