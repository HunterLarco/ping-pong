import run from "@rollup/plugin-run";
import graphql from '@rollup/plugin-graphql';

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
  ],
  plugins: [
    graphql(),
    process.env.NODE_ENV == "development" && run(),
  ],
  watch: {
    buildDelay: 500,
  },
};
