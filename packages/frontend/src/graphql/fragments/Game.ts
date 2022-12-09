import gql from 'graphql-tag';

import PlayerFragment from '@/graphql/fragments/Player.js';

export default gql`
  ${PlayerFragment}
  fragment GameFragment on Game {
    id
    dateCreated
    dateEnded
    dateStarted
    players {
      ...PlayerFragment
    }
  }
`;
