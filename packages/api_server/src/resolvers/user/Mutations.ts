import { GraphQLError } from 'graphql';

import { MutationResolvers } from '@generated/graphql/user_service/resolvers';
import { AuthScopeCode } from '@prisma/client';

export const resolvers: MutationResolvers = {
  async signup(_0, { request }, { globalContext, dataSources }) {
    const [phoneNumber] = await dataSources.AuthToken.use({
      id: request.identityVerificationToken,
      requiredScopeCodes: [AuthScopeCode.PhoneVerification],
    });

    const user = await dataSources.User.createUser({
      name: request.name,
      phoneNumber,
    });

    const authToken = await dataSources.AuthToken.createUserAuthToken(user.id);

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
      throw new GraphQLError(
        `User for phone number ${phoneNumber} not found.`,
        { extensions: { code: 'NOT_FOUND' } }
      );
    }

    const authToken = await dataSources.AuthToken.createUserAuthToken(user.id);

    return {
      authToken: authToken.id,
    };
  },
};
