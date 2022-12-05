import type { CodegenConfig } from '@graphql-codegen/cli';

const kMappers = {
  Game: '@prisma/client#Game as GameModel',
  Player: '@prisma/client#Player as PlayerModel',
  User: '@prisma/client#User as UserModel',
  Viewer: '@prisma/client#User as UserModel',
  IdentityCard: '@prisma/client#IdentityCard as IdentityCardModel',
  DebugMutations: '{}',
};

const kResolverConfig = {
  contextType: '@/RequestContext#RequestContext',
  mappers: kMappers,
};

const kServiceList = [
  'debug_service',
  'game_service',
  'user_service',
  'identity_card_service',
  'verification_service',
];

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
  },
};

for (const serviceName of kServiceList) {
  config.generates[`./generated/graphql/${serviceName}/resolvers.ts`] = {
    schema: `./graphql/${serviceName}/**/*.graphql`,
    plugins: ['typescript', 'typescript-resolvers'],
    config: kResolverConfig,
  };
}

export default config;
