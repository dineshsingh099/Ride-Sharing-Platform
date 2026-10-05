import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type Role = "user" | "partner" | "admin";

const ALL_ROLES: Role[] = ["user", "partner", "admin"];

const LABELS: Record<Role, string> = {
	user: "user",
	partner: "driver",
	admin: "admin",
};

function isValid(token: string | undefined, secret: string | undefined) {
	if (!token || !secret) return false;
	try {
		jwt.verify(token, secret);
		return true;
	} catch {
		return false;
	}
}

function hasActiveSession(req: Request, role: Role) {
	return (
		isValid(
			req.cookies?.[`${role}AccessToken`],
			process.env.ACCESS_TOKEN_SECRET,
		) ||
		isValid(
			req.cookies?.[`${role}RefreshToken`],
			process.env.REFRESH_TOKEN_SECRET,
		)
	);
}

export function blockOtherRoleSession(role: Role) {
	return function (req: Request, res: Response, next: NextFunction) {
		const active = ALL_ROLES.find(
			(other) => other !== role && hasActiveSession(req, other),
		);

		if (active) {
			return res.status(409).json({
				message: `You are already logged in as ${LABELS[active]}. Please logout first.`,
			});
		}

		next();
	};
}
