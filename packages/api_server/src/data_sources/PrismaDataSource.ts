import { PrismaClient } from '@prisma/client'

export async function initiatePrismaClient() {
  const prisma = new PrismaClient()
  await prisma.$connect()
  return prisma;
}

export class PrismaDataSource {
  #prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.#prismaClient = prismaClient;
  }
}
