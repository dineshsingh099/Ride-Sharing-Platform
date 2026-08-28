import { body } from "express-validator";
import { validate } from "./validators";

export const registerValidation = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 3, max: 50 })
		.withMessage("Name must be between 3 and 50 characters"),
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email address is required")
		.isEmail()
		.withMessage("Please enter a valid email address")
		.normalizeEmail(),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	validate,
];

export const loginValidation = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email address is required")
		.isEmail()
		.withMessage("Please enter a valid email address")
		.normalizeEmail(),
	body("password").notEmpty().withMessage("Password is required"),
	validate,
];

export const verifyOtpValidation = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email address is required")
		.isEmail()
		.withMessage("Please enter a valid email address")
		.normalizeEmail(),
	body("otp")
		.trim()
		.notEmpty()
		.withMessage("OTP is required")
		.isLength({ min: 6, max: 6 })
		.withMessage("OTP must be 6 digits"),
	validate,
];

export const resendOtpValidation = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email address is required")
		.isEmail()
		.withMessage("Please enter a valid email address")
		.normalizeEmail(),
	validate,
];
