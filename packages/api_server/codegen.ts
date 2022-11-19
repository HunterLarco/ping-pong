import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema/*.graphql',
  generates: {
    './generated/schema/api.graphql': {
      plugins: ['schema-ast'],
    },
    './generated/schema/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};
export default config;
