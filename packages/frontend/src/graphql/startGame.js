import gql from 'graphql-tag';

export default gql`
  mutation StartGame($request: StartGameRequest!) {
    startGame(request: $request) {
      game {
        id
      }
    }
  }
`;
