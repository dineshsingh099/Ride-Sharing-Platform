import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const messages = errors.array().map((err) => err.msg);
		return res.status(400).json({ message: messages[0], errors: messages });
	}
	next();
};
