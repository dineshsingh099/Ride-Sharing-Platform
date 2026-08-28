import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Partner from "../models/partner";
import Session from "../models/session.model";
import {
	generateAccessToken,
	generateRefreshToken,
	setAuthCookies,
	clearAuthCookies,
	getRefreshTokenExpiry,
} from "../utils/token";
import { sendMail } from "../utils/sendMail";
import {
	generateOtp,
	getOtpExpiry,
	getRemainingCooldown,
	otpEmailTemplate,
	OTP_RESEND_COOLDOWN_SECONDS,
} from "../utils/otp";

interface RefreshPayload {
	id: string;
	role: string;
}

export async function registerPartner(req: Request, res: Response) {
	try {
		const { name, email, password } = req.body;

		const existingPartner = await Partner.findOne({ email });
		if (existingPartner) {
			return res.status(409).json({ message: "Partner already exists" });
		}

		const otp = generateOtp();

		const newPartner = await Partner.create({
			name,
			email,
			password,
			role: "partner",
			otp,
			otpExpiresAt: getOtpExpiry(),
			otpSentAt: new Date(),
		});

		sendMail(
			newPartner.email,
			"Verify your account",
			otpEmailTemplate(newPartner.name, otp),
		).catch((err) => console.error("Failed to send OTP email:", err));

		return res.status(201).json({
			message: "Registration successful. OTP sent to your email, please verify your account.",
			partner: {
				id: newPartner._id,
				name: newPartner.name,
				email: newPartner.email,
				role: newPartner.role,
				isEmailVerified: newPartner.isEmailVerified,
			},
			retryAfter: OTP_RESEND_COOLDOWN_SECONDS,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function verifyPartnerOtp(req: Request, res: Response) {
	try {
		const { email, otp } = req.body;

		const partner = await Partner.findOne({ email }).select("+otp");
		if (!partner) {
			return res.status(404).json({ message: "Partner not found" });
		}

		if (partner.isEmailVerified) {
			return res.status(400).json({ message: "Account already verified" });
		}

		if (!partner.otp || !partner.otpExpiresAt) {
			return res
				.status(400)
				.json({ message: "No OTP found, please request a new one" });
		}

		if (partner.otpExpiresAt.getTime() < Date.now()) {
			return res
				.status(400)
				.json({ message: "OTP expired, please request a new one" });
		}

		if (!(await partner.compareOtp(otp))) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		partner.isEmailVerified = true;
		partner.otp = undefined;
		partner.otpExpiresAt = undefined;
		partner.otpSentAt = undefined;
		await partner.save();

		return res.status(200).json({ message: "Account verified successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function resendPartnerOtp(req: Request, res: Response) {
	try {
		const { email } = req.body;

		const partner = await Partner.findOne({ email }).select("+otp");
		if (!partner) {
			return res.status(404).json({ message: "Partner not found" });
		}

		if (partner.isEmailVerified) {
			return res.status(400).json({ message: "Account already verified" });
		}

		const remaining = getRemainingCooldown(partner.otpSentAt);
		if (remaining > 0) {
			return res.status(429).json({
				message: `Please wait ${remaining} seconds before requesting a new OTP`,
				retryAfter: remaining,
			});
		}

		const otp = generateOtp();
		partner.otp = otp;
		partner.otpExpiresAt = getOtpExpiry();
		partner.otpSentAt = new Date();
		await partner.save();

		sendMail(
			partner.email,
			"Resend OTP - Verify your account",
			otpEmailTemplate(partner.name, otp),
		).catch((err) => console.error("Failed to send OTP email:", err));

		return res.status(200).json({
			message: "OTP resent successfully",
			retryAfter: OTP_RESEND_COOLDOWN_SECONDS,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function loginPartner(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		const partner = await Partner.findOne({ email }).select("+password");
		if (!partner || !(await partner.comparePassword(password))) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		if (!partner.isEmailVerified) {
			return res.status(403).json({
				message: "Please verify your account with the OTP sent to your email before logging in",
				isEmailVerified: false,
			});
		}

		const accessToken = generateAccessToken({
			id: partner._id.toString(),
			role: partner.role,
		});
		const refreshToken = generateRefreshToken({
			id: partner._id.toString(),
			role: partner.role,
		});

		await Session.create({
			userId: partner._id,
			role: partner.role,
			token: refreshToken,
			expiresAt: getRefreshTokenExpiry(),
		});

		setAuthCookies(res, "partner", accessToken, refreshToken);

		return res.status(200).json({
			message: "Login successful",
			partner: {
				id: partner._id,
				name: partner.name,
				email: partner.email,
				role: partner.role,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function refreshPartnerAccessToken(req: Request, res: Response) {
	try {
		const token = req.cookies?.partnerRefreshToken;
		if (!token) {
			return res.status(401).json({ message: "Refresh token missing" });
		}

		let decoded: RefreshPayload;
		try {
			decoded = jwt.verify(
				token,
				process.env.REFRESH_TOKEN_SECRET!,
			) as RefreshPayload;
		} catch (error) {
			clearAuthCookies(res, "partner");
			return res.status(403).json({ message: "Refresh token expired" });
		}

		const session = await Session.findMatchingSession(
			decoded.id,
			"partner",
			token,
		);
		if (!session) {
			clearAuthCookies(res, "partner");
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		await Session.deleteOne({ _id: session._id });

		const newAccessToken = generateAccessToken({
			id: decoded.id,
			role: "partner",
		});
		const newRefreshToken = generateRefreshToken({
			id: decoded.id,
			role: "partner",
		});

		await Session.create({
			userId: decoded.id,
			role: "partner",
			token: newRefreshToken,
			expiresAt: getRefreshTokenExpiry(),
		});

		setAuthCookies(res, "partner", newAccessToken, newRefreshToken);

		return res.status(200).json({ message: "Token refreshed" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function getCurrentPartner(req: Request, res: Response) {
	try {
		const partner = await Partner.findById(req.user?.id);
		if (!partner) {
			return res.status(404).json({ message: "Partner not found" });
		}

		return res.status(200).json({
			partner: {
				id: partner._id,
				name: partner.name,
				email: partner.email,
				role: partner.role,
				avatar: partner.avatar,
				isEmailVerified: partner.isEmailVerified,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function logoutPartner(req: Request, res: Response) {
	try {
		const token = req.cookies?.partnerRefreshToken;
		if (token) {
			try {
				const decoded = jwt.verify(
					token,
					process.env.REFRESH_TOKEN_SECRET!,
					{ ignoreExpiration: true },
				) as RefreshPayload;
				const session = await Session.findMatchingSession(
					decoded.id,
					"partner",
					token,
				);
				if (session) {
					await Session.deleteOne({ _id: session._id });
				}
			} catch (error) {}
		}
		clearAuthCookies(res, "partner");
		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}
