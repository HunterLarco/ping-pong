import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  generates: {
    './generated/graphql/ast.ts': {
      schema: './graphql/**/*.graphql',
      plugins: ['@ping-pong/generate_graphql_ast'],
    },
    './generated/graphql/resolvers.ts': {
      schema: './graphql/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@/RequestContext#RequestContext',
        defaultMapper: 'Partial<{T}>',
      },
    },
    './generated/graphql/game_service/resolvers.ts': {
      schema: './graphql/game_service/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@/RequestContext#RequestContext',
        defaultMapper: 'Partial<{T}>',
      },
    },
    './generated/graphql/user_service/resolvers.ts': {
      schema: './graphql/user_service/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@/RequestContext#RequestContext',
        defaultMapper: 'Partial<{T}>',
      },
    },
    './generated/graphql/identity_card_service/resolvers.ts': {
      schema: './graphql/identity_card_service/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@/RequestContext#RequestContext',
        defaultMapper: 'Partial<{T}>',
      },
    },
    './generated/graphql/verification_service/resolvers.ts': {
      schema: './graphql/verification_service/**/*.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@/RequestContext#RequestContext',
        defaultMapper: 'Partial<{T}>',
      },
    },
  },
};

export default config;
