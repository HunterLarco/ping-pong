import { Resolvers } from '@generated/graphql/user_service/resolvers';
import { AuthScopeCode } from '@prisma/client';

const UserResolvers: Resolvers = {
  Query: {
    me(_0, _1, { actor }) {
      if (!actor) {
        return null;
      }

      return {
        id: actor.id,
        name: actor.name,
      }
    }
  },

  Mutation: {
    async signup(_0, { request }, { globalContext, dataSources }) {
      const [phoneNumber] = await dataSources.AuthToken.use({
        id: request.identityVerificationToken,
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
        id: request.identityVerificationToken,
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

export default UserResolvers;
