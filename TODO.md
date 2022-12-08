## TODO

- Features
  - Life counters
    - Life total
    - Commander damage
- Productionization
  - `spectate` endpoint should send the game state as the first event.
     This helps to avoid multiple round trips to fetch game state and
     allows the frontend to trivially fetch the user and transition into
     the current game.
- Better developer experience
  - Endpoint to automatically create 4 users and add them to a game
  - Script to start and configure mongodb locally
