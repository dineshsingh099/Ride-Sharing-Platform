import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";
import Partner, { IPartner } from "../models/partner";
import Session from "../models/session.model";
import GoogleNonce from "../models/googleNonce.model";
import {
	googleAuthService,
	GoogleUserPayload,
} from "../services/google.services";
import { generateNonce, hashNonce } from "../utils/googleNonce";
import {
	generateAccessToken,
	generateRefreshToken,
	setAuthCookies,
	getRefreshTokenExpiry,
} from "../utils/token";

const NONCE_TTL_MS = 5 * 60 * 1000;

class AuthError extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;
	}
}

async function issueNonce(res: Response, role: "user" | "partner") {
	const rawNonce = generateNonce();
	const hashedNonce = hashNonce(rawNonce);

	await GoogleNonce.create({
		hashedNonce,
		role,
		expiresAt: new Date(Date.now() + NONCE_TTL_MS),
	});

	return res.status(200).json({ nonce: rawNonce });
}

async function verifyGoogleCredential(
	credential: string,
	rawNonce: string,
): Promise<GoogleUserPayload> {
	try {
		return await googleAuthService.verifyGoogleToken(credential, rawNonce);
	} catch (error) {
		throw new AuthError(
			401,
			"Invalid or expired Google sign-in. Please try again.",
		);
	}
}

async function consumeNonce(rawNonce: string, role: "user" | "partner") {
	const hashedNonce = hashNonce(rawNonce);

	const record = await GoogleNonce.findOneAndDelete({
		hashedNonce,
		role,
		expiresAt: { $gt: new Date() },
	});

	if (!record) {
		throw new AuthError(
			400,
			"This sign-in attempt has expired. Please try again.",
		);
	}
}

async function establishSession(res: Response, account: IUser | IPartner) {
	const role = account.role as "user" | "partner";

	const accessToken = generateAccessToken({
		id: account._id.toString(),
		role,
	});
	const refreshToken = generateRefreshToken({
		id: account._id.toString(),
		role,
	});

	await Session.create({
		userId: account._id,
		role,
		token: refreshToken,
		expiresAt: getRefreshTokenExpiry(),
	});

	setAuthCookies(res, role, accessToken, refreshToken);
}

function serializeAccount(account: IUser | IPartner) {
	return {
		id: account._id,
		name: account.name,
		email: account.email,
		role: account.role,
		avatar: account.avatar,
	};
}

function createGoogleLoginHandler(
	role: "user" | "partner",
	Model: mongoose.Model<any>,
	responseKey: "user" | "partner",
) {
	return async function handleGoogleLogin(req: Request, res: Response) {
		try {
			const { credential, nonce } = req.body;

			if (!credential || !nonce) {
				throw new AuthError(400, "Google credential and nonce are required");
			}

			const googleUser = await verifyGoogleCredential(credential, nonce);

			await consumeNonce(nonce, role);

			let account = await Model.findOne({ googleId: googleUser.googleId });

			if (!account) {
				const existingByEmail = await Model.findOne({
					email: googleUser.email,
				});

				if (existingByEmail && !existingByEmail.googleId) {
					throw new AuthError(401, "Google sign-in failed. Please try again.");
				}

				if (existingByEmail) {
					account = existingByEmail;
				}
			}

			if (!account) {
				account = await Model.create({
					name: googleUser.name || googleUser.email.split("@")[0],
					email: googleUser.email,
					googleId: googleUser.googleId,
					avatar: googleUser.avatar,
					authProvider: "google",
					isEmailVerified: true,
					role,
				});
			}

			await establishSession(res, account);

			return res.status(200).json({
				message: "Login successful",
				[responseKey]: serializeAccount(account),
			});
		} catch (error) {
			if (error instanceof AuthError) {
				return res.status(error.statusCode).json({ message: error.message });
			}
			console.error(error);
			return res
				.status(500)
				.json({ message: "Google sign-in failed. Please try again." });
		}
	};
}

export async function getUserGoogleNonce(req: Request, res: Response) {
	try {
		return await issueNonce(res, "user");
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Something went wrong. Please try again." });
	}
}

export async function getPartnerGoogleNonce(req: Request, res: Response) {
	try {
		return await issueNonce(res, "partner");
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: "Something went wrong. Please try again." });
	}
}

export const googleLoginUser = createGoogleLoginHandler("user", User, "user");
export const googleLoginPartner = createGoogleLoginHandler(
	"partner",
	Partner,
	"partner",
);
