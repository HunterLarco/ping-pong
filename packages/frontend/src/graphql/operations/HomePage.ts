import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';

export default gql`
  ${GameFragment}
  query HomePage {
    viewer: me {
      id
      name
      currentGame {
        ...GameFragment
      }
    }
  }
`;
