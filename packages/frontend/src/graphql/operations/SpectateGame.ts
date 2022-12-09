import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';

export default gql`
  subscription SpectateGame($gameId: ID!) {
    spectate(request: { gameId: $gameId }) {
      timestamp
      type
    }
  }
`;
