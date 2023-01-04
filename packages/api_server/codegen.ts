import type { CodegenConfig } from '@graphql-codegen/cli';

const kMappers = {
  MessageLog: '@prisma/client#MessageHistory as MessageHistoryModel',
};

const kResolverConfig = {
  contextType: '@/RequestContext#RequestContext',
  mappers: kMappers,
};

const kServiceList = ['ping_pong_service'];

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
