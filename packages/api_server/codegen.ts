import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './graphql/**/*.graphql',
  generates: {
    './generated/graphql/ast.ts': {
      plugins: ['@ping-pong/generate_graphql_ast'],
    },
    './generated/graphql/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '@/RequestContext#RequestContext',
        defaultMapper: 'Partial<{T}>',
      },
    },
  },
};

export default config;
