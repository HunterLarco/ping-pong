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
    '@apollo/server/standalone',
    '@graphql-tools/merge',
    'dataloader',
    'fuzzy-search',
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
