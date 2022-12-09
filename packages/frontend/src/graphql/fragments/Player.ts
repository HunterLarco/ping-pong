import gql from 'graphql-tag';

import IdentityCardFragment from '@/graphql/fragments/IdentityCard.js';
import UserFragment from '@/graphql/fragments/User.js';

export default gql`
  ${UserFragment}
  ${IdentityCardFragment}
  fragment PlayerFragment on Player {
    user {
      ...UserFragment
    }
    state
    identity {
      ...IdentityCardFragment
    }
    unveiled
  }
`;
