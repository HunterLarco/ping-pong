import graphql from '@rollup/plugin-graphql';
import alias from '@rollup/plugin-alias';
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
    'node-fetch',
    'p-memoize',
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
      },
    }),
    process.env.NODE_ENV == 'development' && run(),
  ],
  watch: {
    buildDelay: 500,
  },
};
