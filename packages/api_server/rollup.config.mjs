import graphql from '@rollup/plugin-graphql';
import alias from '@rollup/plugin-alias';
import run from '@rollup/plugin-run';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/server.mjs',
    format: 'es',
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
    'dotenv',
    'expiry-map',
    'express',
    'fuzzy-search',
    'graphql',
    'graphql-scalars',
    'graphql-subscriptions',
    'graphql-ws/lib/use/ws',
    'http',
    'node-fetch',
    'p-memoize',
    'pick-random',
    'shuffle-array',
    'twilio',
    'uuid',
    'ws',
    'zod',
  ],
  plugins: [
    graphql(),
    alias({
      entries: [
        {
          find: /^@generated\/(.*\.graphql)$/,
          replacement: './generated/$1',
        },
      ],
    }),
    typescript({
      tsconfig: false,
      compilerOptions: {
        allowJs: false,
        allowSyntheticDefaultImports: true,
        baseUrl: './',
        forceConsistentCasingInFileNames: true,
        noEmitOnError: true,
        noImplicitAny: true,
        paths: {
          '@/*': ['src/*'],
          '@generated/*': ['generated/*'],
        },
        preserveConstEnums: true,
        skipLibCheck: true,
        strict: true,
        target: 'es2016',
      },
    }),
    process.env.NODE_ENV == 'development' && run(),
  ],
  watch: {
    buildDelay: 500,
  },
};
