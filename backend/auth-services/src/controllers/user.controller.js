import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { extractToken } from "../utils/extractToken.js";
import BlacklistToken from "../models/blacklistToken.js"
import {transporter} from "../utils/mailsend.js";

export async function UserRegister(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, phone, password } = req.body;
		if (!name || !email || !phone || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existingUser = await userModel.findOne({
			$or: [{ email }, { phone }],
		});
		if (existingUser)
			return res.status(409).json({ message: "User already exists" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await userModel.create({
			name,
			email,
			phone,
			password: hashedPassword,
		});

		if (!process.env.JWT_SECRET) {
			console.error("JWT_SECRET missing");
			return res.status(500).json({ message: "Server misconfiguration" });
		}

		const token = jwt.sign(
			{ id: user._id.toString(), role: "user" },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.cookie("token_user", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		
		await transporter.sendMail({
			from: `Ride Sharing Platform <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: "Welcome to Ride Sharing Platform",
			text: `Hello ${user.name},

Thank you for registering at Ride Sharing Platform!
We're excited to have you on board.

Best regards,
Ride Sharing Platform Team`,
		});

		return res.status(201).json({
			message: "User registered successfully",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
			},
		});
	} catch (error) {
		console.error("UserRegister error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function UserLogin(req, res) {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, phone, password } = req.body;
		const user = await userModel
			.findOne(email ? { email } : { phone })
			.select("+password");

		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const token = jwt.sign(
			{ id: user._id.toString(), role: "user" },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.cookie("token_user", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			message: "Login successful",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				phone: user.phone,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function UserLogout(req, res) {
	try {
		const token = extractToken(req);

		if (token) {
			try {
				await BlacklistToken.create({ token });
			} catch (err) {
				if (err.code !== 11000) {
					console.error("BlacklistToken create error:", err);
					return res.status(500).json({ message: "Internal server error" });
				}
			}
		}

		res.clearCookie("token_user", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
		});

		return res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		console.error("UserLogout general error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function UserProfile(req, res) {
	try {
		return res.status(200).json({ user: {
			_id: req.user._id,
			name: req.user.name,
			email: req.user.email,
			phone: req.user.phone,
			isAccountVerified: req.user.isAccountVerified
		} });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function sendVerifyOtp(req, res) {
	try {
		const userId = req.user?._id;
		
		if (!userId) {
			return res.status(400).json({ message: "User id is required" });
		}

		const user = await userModel.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (user.isAccountVerified) {
			return res.status(400).json({ message: "Account already verified" });
		}

		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		user.verifyOtp = otp;
		user.verifyOtpExpiryAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

		await user.save();

		await transporter.sendMail({
			from: `Ride Sharing Platform <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: "Account Verification OTP",
			text: `Your OTP is ${otp}. Verify your account using this OTP.`,
		});
		
			
		return res
			.status(200)
			.json({ message: "Verification OTP sent to your email" });
			
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function verifyUserAccount(req, res) {
	const { otp } = req.body;
	
	if (!otp) {
		return res.status(400).json({ message: "OTP is required" });
	}
	
	try {
		const userId = req.user?._id;
		const user = await userModel.findById(userId);
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		if (user.verifyOtp === '' || user.verifyOtp !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}
		
		if (user.verifyOtpExpiryAt < Date.now()) {
			return res.status(400).json({ message: "OTP has expired" });
		}
		
		user.isAccountVerified = true;
		user.verifyOtp = '';
		user.verifyOtpExpiryAt = null;
		
		await user.save();
		
		return res.status(200).json({ message: "Account verified successfully" });
	}
	catch (error) {
			return res.status(500).json({ message: "Internal server error" });
	}
}

export async function resendVerifyOtp(req, res) {
	try {
		const userId = req.user?._id;

		if (!userId)
			return res.status(400).json({ message: "User id is required" });

		const user = await userModel.findById(userId);

		if (!user) return res.status(404).json({ message: "User not found" });

		if (user.isAccountVerified)
			return res.status(400).json({ message: "Account already verified" });

		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		user.verifyOtp = otp;
		user.verifyOtpExpiryAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

		await user.save();

		await transporter.sendMail({
			from: `Ride Sharing Platform <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: "Account Verification OTP",
			text: `Your OTP is ${otp}. Verify your account using this OTP.`,
		});

		return res.status(200).json({ message: "New OTP sent to your email" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function sendResetOtp(req, res) {
	const { email } = req.body;
	
	if (!email) {
		return res.status(400).json({ message: "Email is required" });
	}
	
	try {
		const user = await userModel.findOne({ email });
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		user.resetOtp = otp;
		user.resetOtpExpiryAt = new Date(Date.now() + 15 * 60 * 1000);

		await user.save();

		await transporter.sendMail({
			from: `Ride Sharing Platform <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: "Account Reset OTP",
			text: `Your OTP is ${otp}. Use this OTP to reset your account password.`,
		});

		return res
			.status(200)
			.json({ message: "Reset OTP sent to your email" });
			
		
		
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function resetUserPassword(req, res) {
	const { email, otp, newPassword } = req.body;
	
	if (!email || !otp || !newPassword) {
		return res.status(400).json({ message: "Email, OTP and new password are required" });
	}
	
	try {
		
		const user = await userModel.findOne({ email });
		
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		
		if (!user.resetOtp || user.resetOtp !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}
		
		if (
			!user.resetOtpExpiryAt ||
			user.resetOtpExpiryAt.getTime() < Date.now()
		) {
			return res.status(400).json({ message: "OTP has expired" });
		}
		
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		
		user.password = hashedPassword;
		user.resetOtp = "";
		user.resetOtpExpiryAt = null;
		
		await user.save();
		
		return res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
		console.error("sendResetOtp error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
	
}



