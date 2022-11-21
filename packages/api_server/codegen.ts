import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema/*.graphql',
  generates: {
    './generated/schema/ast.ts': {
      plugins: ['@ping-pong/generate_graphql_ast'],
    },
    './generated/schema/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default config;
