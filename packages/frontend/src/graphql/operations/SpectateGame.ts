import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';

export default gql`
  ${GameFragment}
  subscription SpectateGame($gameId: ID!) {
    spectate(request: { gameId: $gameId }) {
      timestamp
      type
      details {
        ... on ConnectEvent {
          game {
            ...GameFragment
          }
        }
      }
    }
  }
`;
