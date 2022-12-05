import gql from 'graphql-tag';

export default gql`
  fragment PlayerFragment on Player {
    user {
      name
      id
    }
    state
    identity {
      name
      type
      image
      source
    }
    unveiled
  }
`;
