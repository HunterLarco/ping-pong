import gql from 'graphql-tag';

export default gql`
  fragment IdentityCardFragment on IdentityCard {
    name
    type
    image
    source
  }
`;
