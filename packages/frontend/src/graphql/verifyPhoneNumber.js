import gql from 'graphql-tag';

export default gql`
  mutation verifyPhoneNumber($request: VerifyPhoneNumberRequest!) {
    verifyPhoneNumber(request: $request) {
      verificationToken
    }
  }
`;
