import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';

export default gql`
  ${GameFragment}
  query getGame($gameId: ID!) {
    game: getGameById(id: $gameId) {
      ...GameFragment
    }
  }
`;
