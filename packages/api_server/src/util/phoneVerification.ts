import type { GlobalContext } from '@/GlobalContext';

export async function issuePhoneVerification(args: {
  globalContext: GlobalContext;
  phoneNumber: string;
}): Promise<void> {
  const { globalContext, phoneNumber } = args;

  if (process.env.NODE_ENV == 'development') {
    return;
  }

  await globalContext.twilio.verifyService.verifications.create({
    to: phoneNumber,
    channel: 'sms',
  });
}

export async function checkOneTimePassword(args: {
  globalContext: GlobalContext;
  phoneNumber: string;
  oneTimePassword: string;
}): Promise<boolean> {
  const { globalContext, phoneNumber, oneTimePassword } = args;

  if (process.env.NODE_ENV == 'development') {
    // Hardcoded verification one time password for development purposes.
    return oneTimePassword == '000000';
  }

  const twilioResult =
    await globalContext.twilio.verifyService.verificationChecks.create({
      to: phoneNumber,
      code: oneTimePassword,
    });

  return twilioResult.status == 'approved';
}
