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
	body("number")
		.trim()
		.notEmpty()
		.withMessage("Vehicle number is required"),
	validate,
];

export const bankDetailsValidation = [
	body("accountHolderName")
		.trim()
		.notEmpty()
		.withMessage("Account holder name is required"),
	body("accountNumber")
		.trim()
		.notEmpty()
		.withMessage("Account number is required"),
	body("ifscCode")
		.trim()
		.notEmpty()
		.withMessage("IFSC code is required"),
	body("phoneNumber")
		.trim()
		.notEmpty()
		.withMessage("Phone number is required")
		.isMobilePhone("any")
		.withMessage("Enter a valid phone number"),
	body("upiId").optional({ checkFalsy: true }).trim(),
	validate,
];
