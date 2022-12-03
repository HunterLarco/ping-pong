## TODO

- Better error messages
  - Use express error types to get correct HTTP error codes
  - GraphQL errors should send non 200 HTTP error code
  - Prisma Errors should be contextualized, e.g. not "write failed" but "user already conceded"
- Better developer experience
  - Endpoint to automatically create 4 users and add them to a game
