import { body } from "express-validator";
import { validate } from "./validators";

export const vehicleDetailsValidation = [
	body("type")
		.trim()
		.notEmpty()
		.withMessage("Vehicle type is required")
		.isIn(["bike", "car", "auto", "suv", "Bus", "loading"])
		.withMessage("Invalid vehicle type"),
	body("vehicleModel")
		.trim()
		.notEmpty()
		.withMessage("Vehicle model is required"),
	body("number").trim().notEmpty().withMessage("Vehicle number is required"),
	validate,
];

export const bankDetailsValidation = [
	body("accountHolderName")
		.trim()
		.notEmpty()
		.withMessage("Account holder name is required")
		.isLength({ min: 3 })
		.withMessage("Account holder name must be at least 3 characters"),
	body("accountNumber")
		.trim()
		.notEmpty()
		.withMessage("Account number is required")
		.matches(/^\d{9,18}$/)
		.withMessage("Account number must be 9 to 18 digits"),
	body("ifscCode")
		.trim()
		.notEmpty()
		.withMessage("IFSC code is required")
		.customSanitizer((value) => String(value).toUpperCase())
		.matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
		.withMessage("Enter a valid IFSC code (e.g. SBIN0001234)"),
	body("phoneNumber")
		.trim()
		.notEmpty()
		.withMessage("Phone number is required")
		.matches(/^[6-9]\d{9}$/)
		.withMessage("Enter a valid 10 digit mobile number"),
	body("upiId")
		.optional({ checkFalsy: true })
		.trim()
		.matches(/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/)
		.withMessage("Enter a valid UPI ID (e.g. name@upi)"),
	validate,
];
