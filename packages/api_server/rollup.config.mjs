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
    graphql(),
    typescript({
      tsconfig: false,
      compilerOptions: {
        allowJs: false,
        allowSyntheticDefaultImports: true,
        baseUrl: './src',
        forceConsistentCasingInFileNames: true,
        noEmitOnError: true,
        // TODO: noImplicitAny should be true
        strict: false,
        noImplicitAny: false,
        paths: {
          '@/*': ['*'],
        },
        preserveConstEnums: true,
        skipLibCheck: true,
        // TODO: strict should be true
        strict: false,
      },
    }),
    process.env.NODE_ENV == 'development' && run(),
  ],
  watch: {
    buildDelay: 500,
  },
};
