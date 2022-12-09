import gql from 'graphql-tag';

import GameFragment from '@/graphql/fragments/Game.js';

export default gql`
  ${GameFragment}
  query GetViewer {
    me {
      id
      name
      currentGame {
        ...GameFragment
      }
    }
  }
`;
