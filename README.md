## Getting Started

First your need to install (most) of our dependencies:

```
nvm use
npm run initialize
```

And add a new file to `packages/api_server/.env` with the following data.

```
DATABASE_URL="mongodb://localhost/db?directConnection=true"
```

Afterwards you should verify that everything installed correctly by building the
project. This has the added benefit of populating our build caches for more
streamlined development.

```
npm run build
```

If that worked, we can start the local development workflow! First you'll need
to setup a mongodb instance for the backend to persist data (the following steps
will require manually installing docker and mongosh).

```
docker run -p 27017:27017 mongo --replSet rs0
```

Once running, initiate the replica set and configure mongosh to use our
database (named "db").

```
mongosh

> rs.initiate()
> use db
```

Last but not least, you'll need to publish our db indices to mongo:

```
cd packages/api_server
npx prisma db push
```

Done! Now you're prepared to run

```
npm run dev
```

This command will watch the filesystem, automatically restarting the api\_server
when new changes are available and will hot-reload the frontend.

Frontend: http://localhost:5173
API Server: http://localhost:4000/graphql

## Code Quality

Each package as well as the root package support the commands `lint` and
`lint:fix`. For former will check for style conformance, the latter will
auto-format your code to comply with the linter. Please auto-format all code
before committing.

```
npm run lint:fix
```

## Useful Documentation

- Vue: https://vuejs.org/guide/quick-start.html
- Vue Apollo Composition API: https://v4.apollo.vuejs.org/guide-composable/
- Vue Apollo Developer Tools: https://www.apollographql.com/docs/react/development-testing/developer-tooling/#apollo-client-devtools
- Prisma Schema: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- GraphQL Codegen Mappers: https://the-guild.dev/blog/better-type-safety-for-resolvers-with-graphql-codegen
- Federated GraphQL: https://www.apollographql.com/docs/federation/

## Great Articles

- Demystifying Cache Normalization: https://www.apollographql.com/blog/apollo-client/caching/demystifying-cache-normalization/
- Principled GraphQL: https://principledgraphql.com/
