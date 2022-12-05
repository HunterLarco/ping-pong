import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';
import PlayerFragment from '@/graphql/fragments/Player.js';

export default gql`
  ${PlayerFragment}
  ${GameFragment}
  subscription spectate($request: SpectateRequest!) {
    spectate(request: $request) {
      timestamp
      type
      details {
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
