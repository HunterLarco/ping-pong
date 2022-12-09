import { MutationResolvers } from '@generated/graphql/verification_service/resolvers';
import { GraphQLError } from 'graphql';

import {
  checkOneTimePassword,
  issuePhoneVerification,
} from '@/util/phoneVerification';

export const resolvers: MutationResolvers = {
  async issuePhoneVerification(
    _0,
    { request },
    { globalContext, dataSources }
  ) {
    await issuePhoneVerification({
      globalContext,
      phoneNumber: request.phoneNumber,
    });

    const user = await dataSources.User.getByPhoneNumber(request.phoneNumber);

    return {
      knownPhoneNumber: !!user,
    };
  },

  async verifyPhoneNumber(_0, { request }, { globalContext, dataSources }) {
    const isValid = await checkOneTimePassword({
      globalContext,
      phoneNumber: request.phoneNumber,
      oneTimePassword: request.oneTimePassword,
    });

    if (!isValid) {
      throw new GraphQLError(`Incorrect one time password.`, {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    const verificationToken =
      await dataSources.AuthToken.createPhoneVerificationToken(
        request.phoneNumber
      );

    return { verificationToken: verificationToken.id };
  },
};
