```
nvm use
npm run initialize
```

## Useful Documentation

- Vue: https://vuejs.org/guide/quick-start.html
- Vue Apollo Composition API: https://v4.apollo.vuejs.org/guide-composable/

## API Server

```
docker run -p 27017:27017 mongo --replSet rs0

mongosh
> rs.initiate()
> use db

npx prisma db push
```
