import run from '@rollup/plugin-run';
import graphql from '@rollup/plugin-graphql';
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/index.js',
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
    graphql(),
    alias({
      entries: {
        '@': './src',
      },
    }),
    process.env.NODE_ENV == 'development' && run(),
  ],
  watch: {
    buildDelay: 500,
  },
};
