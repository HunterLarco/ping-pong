import { Resolvers } from '@generated/graphql/resolvers';
import { AuthScopeCode } from '@prisma/client';
import {
  issuePhoneVerification,
  checkOneTimePassword,
} from '@/util/phoneVerification';

const AuthResolvers: Resolvers = {
  Mutation: {
    async issuePhoneVerification(_0, { request }, { globalContext }) {
      await issuePhoneVerification({
        globalContext,
        phoneNumber: request.phoneNumber,
      });
    },

    async verifyPhoneNumber(_0, { request }, { globalContext, dataSources }) {
      const isValid = await checkOneTimePassword({
        globalContext,
        phoneNumber: request.phoneNumber,
        oneTimePassword: request.oneTimePassword,
      });

      if (!isValid) {
        throw new Error('Unauthorized');
      }

      const verificationToken =
        await dataSources.AuthToken.createPhoneVerificationToken(
          request.phoneNumber
        );

      return { verificationToken: verificationToken.id };
    },

    async signup(_0, { request }, { globalContext, dataSources }) {
      const [phoneNumber] = await dataSources.AuthToken.use({
        id: request.verificationToken,
        requiredScopeCodes: [AuthScopeCode.PhoneVerification],
      });

      const user = await dataSources.User.createUser({
        name: request.name,
        phoneNumber,
      });

      const authToken = await dataSources.AuthToken.createUserAuthToken(
        user.id
      );

      return {
        authToken: authToken.id,
      };
    },

    async login(_0, { request }, { globalContext, dataSources }) {
      const [phoneNumber] = await dataSources.AuthToken.use({
        id: request.verificationToken,
        requiredScopeCodes: [AuthScopeCode.PhoneVerification],
      });

      const user = await dataSources.User.getByPhoneNumber(phoneNumber);

      if (!user) {
        throw new Error('User not found');
      }

      const authToken = await dataSources.AuthToken.createUserAuthToken(
        user.id
      );

      return {
        authToken: authToken.id,
      };
    },
  },
};

export default AuthResolvers;
