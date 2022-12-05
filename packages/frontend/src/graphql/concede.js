import gql from 'graphql-tag';

export default gql`
  mutation concede($gameId: ID!) {
    concede(gameId: $gameId)
  }
`;
