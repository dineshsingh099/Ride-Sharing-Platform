import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model";
import Session from "../models/session.model";
import {
	generateAccessToken,
	generateRefreshToken,
	setAuthCookies,
	clearAuthCookies,
	getRefreshTokenExpiry,
} from "../utils/token";

interface RefreshPayload {
	id: string;
	role: string;
}

export async function loginAdmin(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		const admin = await Admin.findOne({ email }).select("+password");
		if (!admin || !(await admin.comparePassword(password))) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const accessToken = generateAccessToken({
			id: admin._id.toString(),
			role: admin.role,
		});
		const refreshToken = generateRefreshToken({
			id: admin._id.toString(),
			role: admin.role,
		});

		await Session.create({
			userId: admin._id,
			role: admin.role,
			token: refreshToken,
			expiresAt: getRefreshTokenExpiry(),
		});

		setAuthCookies(res, "admin", accessToken, refreshToken);

		return res.status(200).json({
			message: "Login successful",
			admin: {
				id: admin._id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function refreshAdminAccessToken(req: Request, res: Response) {
	try {
		const token = req.cookies?.adminRefreshToken;
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
			clearAuthCookies(res, "admin");
			return res.status(403).json({ message: "Refresh token expired" });
		}

		if (decoded.role !== "admin") {
			clearAuthCookies(res, "admin");
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		const session = await Session.findMatchingSession(
			decoded.id,
			"admin",
			token,
		);
		if (!session) {
			clearAuthCookies(res, "admin");
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		await Session.deleteOne({ _id: session._id });

		const newAccessToken = generateAccessToken({
			id: decoded.id,
			role: "admin",
		});
		const newRefreshToken = generateRefreshToken({
			id: decoded.id,
			role: "admin",
		});

		await Session.create({
			userId: decoded.id,
			role: "admin",
			token: newRefreshToken,
			expiresAt: getRefreshTokenExpiry(),
		});

		setAuthCookies(res, "admin", newAccessToken, newRefreshToken);

		return res.status(200).json({ message: "Token refreshed" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function getCurrentAdmin(req: Request, res: Response) {
	try {
		const admin = await Admin.findById(req.user?.id);
		if (!admin) {
			return res.status(404).json({ message: "Admin not found" });
		}

		return res.status(200).json({
			admin: {
				id: admin._id,
				name: admin.name,
				email: admin.email,
				role: admin.role,
				avatar: admin.avatar,
				isEmailVerified: admin.isEmailVerified,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}

export async function logoutAdmin(req: Request, res: Response) {
	try {
		const token = req.cookies?.adminRefreshToken;
		if (token) {
			try {
				const decoded = jwt.verify(
					token,
					process.env.REFRESH_TOKEN_SECRET!,
					{ ignoreExpiration: true },
				) as RefreshPayload;
				const session = await Session.findMatchingSession(
					decoded.id,
					"admin",
					token,
				);
				if (session) {
					await Session.deleteOne({ _id: session._id });
				}
			} catch (error) {}
		}
		clearAuthCookies(res, "admin");
		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Something went wrong" });
	}
}
