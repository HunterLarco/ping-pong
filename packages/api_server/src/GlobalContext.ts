import { PrismaClient } from '@prisma/client';

export type GlobalContext = {
  prisma: PrismaClient;
};

export async function createGlobalContext(): Promise<GlobalContext> {
  const prisma = new PrismaClient();
  await prisma.$connect();

  return {
    prisma,
  };
}
