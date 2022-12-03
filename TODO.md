## TODO

- Features
  - Game state protections (e.g. can't unveil twice, can't concede twice)
  - Detect wins and force table unveil
  - Life counters
    - Life total
    - Commander damage
- Productionization
  - Better error messages
    - Use express error types to get correct HTTP error codes
    - GraphQL errors should send non 200 HTTP error code
    - Prisma Errors should be contextualized, e.g. not "write failed" but "user already conceded"
- Better developer experience
  - Endpoint to automatically create 4 users and add them to a game
  - Script to start and configure mongodb locally
