import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';

export default gql`
  ${GameFragment}
  mutation CreateGame {
    createGame {
      game {
        ...GameFragment
      }
    }
  }
`;
