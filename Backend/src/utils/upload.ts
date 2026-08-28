import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const fileFilter = (
	req: Express.Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("INVALID_FILE_TYPE"));
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
	{ name: "license", maxCount: 1 },
	{ name: "rc", maxCount: 1 },
	{ name: "insurance", maxCount: 1 },
	{ name: "aadhar", maxCount: 1 },
]);

export function uploadPartnerDocs(req: Request, res: Response, next: NextFunction) {
	upload(req, res, (err: any) => {
		if (!err) {
			return next();
		}

		if (err instanceof multer.MulterError) {
			if (err.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({ message: "Each file must be under 5MB" });
			}
			if (err.code === "LIMIT_UNEXPECTED_FILE") {
				return res.status(400).json({
					message: "Only license, rc, insurance and aadhar files are accepted",
				});
			}
			return res.status(400).json({ message: "File upload failed" });
		}

		if (err.message === "INVALID_FILE_TYPE") {
			return res.status(400).json({ message: "Only JPG, PNG and PDF files are allowed" });
		}

		return res.status(400).json({ message: "File upload failed, please try again" });
	});
}
