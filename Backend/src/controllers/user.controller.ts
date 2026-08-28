import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Session from "../models/session.model";
import {generateAccessToken,generateRefreshToken,setAuthCookies,clearAuthCookies,getRefreshTokenExpiry} from "../utils/token";
import { sendMail } from '../utils/sendMail'
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

export async function registerUser(req: Request, res: Response) {
	try {
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}

		const otp = generateOtp();

		const newUser = await User.create({
			name,
			email,
			password,
			role: "user",
			otp,
			otpExpiresAt: getOtpExpiry(),
			otpSentAt: new Date(),
		});

		sendMail(
			newUser.email,
			"Verify your account",
			otpEmailTemplate(newUser.name, otp),
		).catch((err) => console.error("Failed to send OTP email:", err));

		return res.status(201).json({
			message: "Registration successful. OTP sent to your email, please verify your account.",
			user: {
				id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
				isEmailVerified: newUser.isEmailVerified,
			},
			retryAfter: OTP_RESEND_COOLDOWN_SECONDS,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function verifyUserOtp(req: Request, res: Response) {
	try {
		const { email, otp } = req.body;

		const user = await User.findOne({ email }).select("+otp");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.isEmailVerified) {
			return res.status(400).json({ message: "Account already verified" });
		}

		if (!user.otp || !user.otpExpiresAt) {
			return res
				.status(400)
				.json({ message: "No OTP found, please request a new one" });
		}

		if (user.otpExpiresAt.getTime() < Date.now()) {
			return res
				.status(400)
				.json({ message: "OTP expired, please request a new one" });
		}

		if (!(await user.compareOtp(otp))) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		user.isEmailVerified = true;
		user.otp = undefined;
		user.otpExpiresAt = undefined;
		user.otpSentAt = undefined;
		await user.save();

		return res.status(200).json({ message: "Account verified successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function resendUserOtp(req: Request, res: Response) {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email }).select("+otp");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.isEmailVerified) {
			return res.status(400).json({ message: "Account already verified" });
		}

		const remaining = getRemainingCooldown(user.otpSentAt);
		if (remaining > 0) {
			return res.status(429).json({
				message: `Please wait ${remaining} seconds before requesting a new OTP`,
				retryAfter: remaining,
			});
		}

		const otp = generateOtp();
		user.otp = otp;
		user.otpExpiresAt = getOtpExpiry();
		user.otpSentAt = new Date();
		await user.save();

		sendMail(
			user.email,
			"Resend OTP - Verify your account",
			otpEmailTemplate(user.name, otp),
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

export async function loginUser(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email }).select("+password");
		if (!user || !(await user.comparePassword(password))) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		if (!user.isEmailVerified) {
			return res.status(403).json({
				message: "Please verify your account with the OTP sent to your email before logging in",
				isEmailVerified: false,
			});
		}

		const accessToken = generateAccessToken({
			id: user._id.toString(),
			role: user.role,
		});
		const refreshToken = generateRefreshToken({
			id: user._id.toString(),
			role: user.role,
		});

		await Session.create({
			userId: user._id,
			role: user.role,
			token: refreshToken,
			expiresAt: getRefreshTokenExpiry(),
		});

		setAuthCookies(res, "user", accessToken, refreshToken);

		return res.status(200).json({
			message: "Login successful",
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function refreshAccessToken(req: Request, res: Response) {
	try {
		const token = req.cookies?.userRefreshToken;
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
			clearAuthCookies(res, "user");
			return res.status(403).json({ message: "Refresh token expired" });
		}

		const session = await Session.findMatchingSession(
			decoded.id,
			"user",
			token,
		);
		if (!session) {
			clearAuthCookies(res, "user");
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		await Session.deleteOne({ _id: session._id });

		const newAccessToken = generateAccessToken({
			id: decoded.id,
			role: "user",
		});
		const newRefreshToken = generateRefreshToken({
			id: decoded.id,
			role: "user",
		});

		await Session.create({
			userId: decoded.id,
			role: "user",
			token: newRefreshToken,
			expiresAt: getRefreshTokenExpiry(),
		});

		setAuthCookies(res, "user", newAccessToken, newRefreshToken);

		return res.status(200).json({ message: "Token refreshed" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function getCurrentUser(req: Request, res: Response) {
	try {
		const user = await User.findById(req.user?.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				avatar: user.avatar,
				isEmailVerified: user.isEmailVerified,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function logoutUser(req: Request, res: Response) {
	try {
		const token = req.cookies?.userRefreshToken;
		if (token) {
			try {
				const decoded = jwt.verify(
					token,
					process.env.REFRESH_TOKEN_SECRET!,
					{ ignoreExpiration: true },
				) as RefreshPayload;
				const session = await Session.findMatchingSession(
					decoded.id,
					"user",
					token,
				);
				if (session) {
					await Session.deleteOne({ _id: session._id });
				}
			} catch (error) {}
		}
		clearAuthCookies(res, "user");
		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}
