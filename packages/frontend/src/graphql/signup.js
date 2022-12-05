import gql from 'graphql-tag';

export default gql`
  mutation signup($request: SignupRequest!) {
    signup(request: $request) {
      authToken
    }
  }
`;
