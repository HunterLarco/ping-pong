import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';
import PlayerFragment from '@/graphql/fragments/Player.js';

export default gql`
  ${GameFragment}
  ${PlayerFragment}
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
        ... on PlayerJoinEvent {
          player {
            ...PlayerFragment
          }
        }
        ... on GameStartEvent {
          game {
            ...GameFragment
          }
        }
        ... on PlayerUpdateEvent {
          player {
            ...PlayerFragment
          }
        }
        ... on GameEndEvent {
          game {
            ...GameFragment
          }
        }
      }
    }
  }
`;
