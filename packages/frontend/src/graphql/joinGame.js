import gql from 'graphql-tag';

export default gql`
  mutation joinGame($request: JoinGameRequest!) {
    joinGame(request: $request)
  }
`;
