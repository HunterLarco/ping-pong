import graphql from '@rollup/plugin-graphql';
import run from '@rollup/plugin-run';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/server.js',
    format: 'cjs',
    sourcemap: true,
  },
  external: [
    '@apollo/server',
    '@apollo/server/express4',
    '@apollo/server/plugin/drainHttpServer',
    '@graphql-tools/merge',
    '@graphql-tools/schema',
    'body-parser',
    'cors',
    'dataloader',
    'express',
    'fuzzy-search',
    'graphql-subscriptions',
    'graphql-ws/lib/use/ws',
    'http',
    'uuid',
    'ws',
  ],
  plugins: [
    typescript({
      compilerOptions: {
        // TODO: noImplicitAny should be true
        noImplicitAny: false,
        preserveConstEnums: true,
        allowSyntheticDefaultImports: true,
        baseUrl: './src',
        paths: {
          '@/*': ['*'],
        },
      },
    }),
    graphql(),
    process.env.NODE_ENV == 'development' && run(),
  ],
  watch: {
    buildDelay: 500,
  },
};
