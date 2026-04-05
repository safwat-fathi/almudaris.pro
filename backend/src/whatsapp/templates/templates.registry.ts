import { z } from 'zod';
import { otpVerification } from './otp-verification';

export const templatesRegistry = {
  otp_verification: {
    contentSidEnv: 'TWILIO_CONTENT_SID_OTP_VERIFICATION',
    variables: {
      otp: 1,
    },
    schema: z.object({
      otp: z.string().trim().min(1),
    }),
    fallbackText: (data: { otp: string }) => otpVerification(data),
  },
} as const;

export type TemplateKey = keyof typeof templatesRegistry;

export type TemplatePayload<K extends TemplateKey> = z.infer<
  (typeof templatesRegistry)[K]['schema']
>;

export type TemplateVariables<K extends TemplateKey> =
  (typeof templatesRegistry)[K]['variables'];
