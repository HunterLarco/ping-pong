import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'node_modules/@ping-pong/api_schema/src/**/*.graphql',
  generates: {
    'generated/resolvers.ts': {
      plugins: [
        {
          add: {
            content: `import { RequestContext } from '@/context';`,
          },
        },
        'typescript',
        'typescript-resolvers',
      ],
      config: {
        contextType: 'RequestContext',
      },
    },
  },
};
export default config;
