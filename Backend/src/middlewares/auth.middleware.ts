import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AccessPayload {
	id: string;
	role: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: AccessPayload;
		}
	}
}

export function authenticate(role: "user" | "partner") {
	return function (req: Request, res: Response, next: NextFunction) {
		const token = req.cookies?.[`${role}AccessToken`];
		if (!token) {
			return res.status(401).json({ message: "Not authenticated" });
		}

		try {
			const decoded = jwt.verify(
				token,
				process.env.ACCESS_TOKEN_SECRET!,
			) as AccessPayload;

			if (decoded.role !== role) {
				return res.status(403).json({ message: "Access denied for this role" });
			}

			req.user = decoded;
			next();
		} catch (error) {
			return res.status(401).json({ message: "Invalid or expired access token" });
		}
	};
}
