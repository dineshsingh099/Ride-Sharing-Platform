import jwt from "jsonwebtoken";
import { Response } from "express";

interface TokenPayload {
	id: string;
	role: string;
}

export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const getRefreshTokenExpiry = () => {
	return new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
};

export const generateAccessToken = (payload: TokenPayload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: "15m",
	});
};

export const generateRefreshToken = (payload: TokenPayload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
		expiresIn: "7d",
	});
};

export const setAuthCookies = (
	res: Response,
	role: "user" | "partner" | "admin",
	accessToken: string,
	refreshToken: string,
) => {
	res.cookie(`${role}AccessToken`, accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 15 * 60 * 1000,
	});

	res.cookie(`${role}RefreshToken`, refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

export const clearAuthCookies = (res: Response, role: "user" | "partner" | "admin") => {
	res.clearCookie(`${role}AccessToken`);
	res.clearCookie(`${role}RefreshToken`);
};
