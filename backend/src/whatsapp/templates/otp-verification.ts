export const otpVerification = ({ otp }: { otp: string }) => `
رمز التحقق الخاص بك في Al-Mudaris Pro هو: ${otp}

هذا الرمز صالح لمدة 5 دقائق فقط.

لا تشارك هذا الرمز مع أي شخص.
`;
