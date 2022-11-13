import fastify from 'fastify'

import pkg from '../package.json'

// CONFIGURATION
const host = 'localhost'
const port = 3333

// APPLICATION
console.log('-'.repeat(60))
console.log(`API Server ${pkg.name} v.${pkg.version}, ${new Date().toLocaleTimeString()}`)
const app = fastify({ logger: true });

// ROUTES
app.get('/', async (request, reply) => {
  return { hello: 'world' }
});

// LISTEN
(async () => {
  try {
    await app.listen({ port })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
})()
