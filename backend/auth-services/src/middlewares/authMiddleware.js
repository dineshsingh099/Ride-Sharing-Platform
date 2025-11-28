import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import BlacklistToken from "../models/blacklistToken.js";

export async function UserAuthMiddleware(req, res, next) {
	try {
		const token =
			req.cookies?.token_user || req.headers.authorization?.split(" ")[1];
		if (!token) return res.status(401).json({ message: "Unauthorized" });

		const isBlacklisted = await BlacklistToken.findOne({ token });
		if (isBlacklisted) return res.status(401).json({ message: "Unauthorized" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await userModel.findById(decoded.id);
		if (!user) return res.status(401).json({ message: "Unauthorized" });

		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized" });
	}
}
