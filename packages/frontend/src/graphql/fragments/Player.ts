import gql from 'graphql-tag';

import UserFragment from '@/graphql/fragments/User.js';
import IdentityCardFragment from '@/graphql/fragments/IdentityCard.js';

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
