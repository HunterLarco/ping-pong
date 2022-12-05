import gql from 'graphql-tag';

export default gql`
  mutation login($request: LoginRequest!) {
    login(request: $request) {
      authToken
    }
  }
`;
