import gql from 'graphql-tag';

export default gql`
  mutation unveil($gameId: ID!) {
    unveil(gameId: $gameId)
  }
`;
