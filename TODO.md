## TODO

- Features
  - Game state protections (e.g. can't unveil twice, can't concede twice)
  - Send game win events to subscriptions
  - Life counters
    - Life total
    - Commander damage
- Productionization
  - Better error messages
    - Prisma Errors should be contextualized, e.g. not "write failed" but "user already conceded"
- Better developer experience
  - Endpoint to automatically create 4 users and add them to a game
  - Script to start and configure mongodb locally
