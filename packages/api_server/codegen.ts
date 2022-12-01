import type { CodegenConfig } from '@graphql-codegen/cli';

const kMappers = {
  Game: '@prisma/client#Game as GameModel',
  User: '@prisma/client#User as UserModel',
  Viewer: '@prisma/client#User as UserModel',
  IdentityCard: '@/data_sources/MTGTreacheryDataSource#OracleCard',
};

const kResolverConfig = {
  contextType: '@/RequestContext#RequestContext',
  mappers: kMappers,
};

const config: CodegenConfig = {
  generates: {
    './generated/graphql/ast.ts': {
      schema: './graphql/**/*.graphql',
      plugins: ['@ping-pong/generate_graphql_ast'],
    },
    './generated/graphql/resolvers.ts': {
      schema: './graphql/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: kResolverConfig,
    },
    './generated/graphql/game_service/resolvers.ts': {
      schema: './graphql/game_service/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: kResolverConfig,
    },
    './generated/graphql/user_service/resolvers.ts': {
      schema: './graphql/user_service/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: kResolverConfig,
    },
    './generated/graphql/identity_card_service/resolvers.ts': {
      schema: './graphql/identity_card_service/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: kResolverConfig,
    },
    './generated/graphql/verification_service/resolvers.ts': {
      schema: './graphql/verification_service/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: kResolverConfig,
    },
  },
};

export default config;
