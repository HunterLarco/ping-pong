```
nvm use
npm run initialize
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

## API Server

```
docker run -p 27017:27017 mongo --replSet rs0

mongosh
> rs.initiate()
> use db

npx prisma db push
```
