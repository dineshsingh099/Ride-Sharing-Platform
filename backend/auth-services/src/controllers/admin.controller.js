import AdminModel from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { extractToken } from "../utils/extractToken.js";
import BlacklistToken from "../models/blacklistToken.js";

export async function registerAdmin(req, res) {
	try {
		const { name, email, phone, password } = req.body;

		if (!name || !email || !phone || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existingAdmin = await AdminModel.findOne({ email });
		if (existingAdmin) {
			return res
				.status(409)
				.json({ message: "Admin with this email already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newAdmin = new AdminModel({
			name,
			email,
			phone,
			password: hashedPassword,
		});
		await newAdmin.save();

		return res.status(201).json({ message: "Admin registered successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function loginAdmin(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		const admin = await AdminModel.findOne({ email }).select("+password");
		if (!admin) {
			return res.status(404).json({ message: "Invalid email or password" });
		}

		const isPasswordValid = await bcrypt.compare(password, admin.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const token = jwt.sign(
			{ id: admin._id.toString(), role: "admin" },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.cookie("token_admin", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 1000,
		});

		return res.status(200).json({
			message: "Login successful",
			admin: {
				_id: admin._id,
				name: admin.name,
				email: admin.email,
				phone: admin.phone,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function logoutAdmin(req, res) {
	try {
		const token = extractToken(req);

		if (token) {
			const decoded = jwt.decode(token);
			let expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : null;
			try {
				await BlacklistToken.create({ token, expiresAt });
			} catch (err) {
				if (err.code !== 11000)
					return res.status(500).json({ message: "Internal server error" });
			}
		}

		res.clearCookie("token_admin", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
		});

		return res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function getAdminProfile(req, res) {
	try {
		return res.status(200).json({
			admin: {
				_id: req.admin._id,
				name: req.admin.name,
				email: req.admin.email,
				phone: req.admin.phone,
			},
		});
	} catch (error) {
		console.error("getAdminProfile error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
}
