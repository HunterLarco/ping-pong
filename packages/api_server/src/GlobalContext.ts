import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import twilio from 'twilio';
import type { ServiceContext as TwilioVerifyService } from 'twilio/lib/rest/verify/v2/service';

export type GlobalContext = {
  prisma: PrismaClient;
  twilio: {
    verifyService: TwilioVerifyService;
  };
};

export async function createGlobalContext(): Promise<GlobalContext> {
  const envResult = dotenv.config();
  if (envResult.error) {
    throw envResult.error;
  } else if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_VERIFY_SID
  ) {
    throw new Error('Invalid environment variable configuration');
  }

  const prisma = new PrismaClient();
  await prisma.$connect();

  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  return {
    prisma,
    twilio: {
      verifyService: twilioClient.verify.v2.services(
        process.env.TWILIO_VERIFY_SID
      ),
    },
  };
}
