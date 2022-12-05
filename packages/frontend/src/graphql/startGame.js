import gql from 'graphql-tag';

export default gql`
  mutation startGame($request: StartGameRequest!) {
    startGame(request: $request) {
      game {
        id
      }
    }
  }
`;
