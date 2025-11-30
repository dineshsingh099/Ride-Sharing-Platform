// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import BlacklistToken from "../models/blacklistToken.js";
import { extractToken } from "../utils/extractToken.js";

export async function UserAuthMiddleware(req, res, next) {
	try {
		const token = extractToken(req);
		if (!token) return res.status(401).json({ message: "Unauthorized" });

		const isBlacklisted = await BlacklistToken.findOne({ token });
		if (isBlacklisted) return res.status(401).json({ message: "Unauthorized" });

		if (!process.env.JWT_SECRET)
			return res.status(500).json({ message: "Server misconfiguration" });

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const user = await userModel.findById(decoded.id).select("-password");
		if (!user) return res.status(401).json({ message: "Unauthorized" });

		req.user = user.toObject();
		next();
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized" });
	}
}
