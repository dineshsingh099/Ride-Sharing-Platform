import crypto from "crypto";

export const OTP_EXPIRE_MINUTES = 10;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const generateOtp = (): string => {
	return crypto.randomInt(100000, 999999).toString();
};

export const getOtpExpiry = (): Date => {
	return new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);
};

export const getRemainingCooldown = (otpSentAt?: Date | null): number => {
	if (!otpSentAt) return 0;
	const elapsedSeconds = (Date.now() - new Date(otpSentAt).getTime()) / 1000;
	const remaining = OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds;
	return remaining > 0 ? Math.ceil(remaining) : 0;
};

export const otpEmailTemplate = (name: string, otp: string): string => {
	return `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
		<h2>Verify your account</h2>
		<p>Hi ${name},</p>
		<p>Your OTP for account verification is:</p>
		<h1 style="letter-spacing: 4px;">${otp}</h1>
		<p>This code will expire in ${OTP_EXPIRE_MINUTES} minutes.</p>
		<p>If you did not request this, please ignore this email.</p>
	</div>`;
};
