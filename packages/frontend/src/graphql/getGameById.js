import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';

export default gql`
  ${GameFragment}
  query getGameById($gameId: ID!) {
    game: getGameById(id: $gameId) {
      ...GameFragment
    }
  }
`;
