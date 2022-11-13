export default {
  build: {
    lib: {
      name: 'api_server',
      entry: 'src/index.js',
    },
    rollupOptions: {
      // Do not bundle third-party dependencies,
      // since server packages can get them via npm install
      external: [
        'fastify',
      ],
      output: {
        globals: {
          'fastify': 'fastify',
        }
      }
    },
    minify: 'eslint'
  }
}
