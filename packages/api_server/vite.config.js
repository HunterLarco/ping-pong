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
        '@fastify/cors',
      ],
      output: {
        globals: {
          'fastify': 'fastify',
          '@fastify/cors': 'cors',
        }
      }
    },
    minify: 'eslint'
  }
}
