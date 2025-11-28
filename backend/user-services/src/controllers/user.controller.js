import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BlacklistToken from "../models/blacklistToken.js";

export async function UserRegister(req, res) {
	try {
		const { name, email, phone, password } = req.body;

		if (!name || !email || !phone || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existingUser = await userModel.findOne({
			$or: [{ email }, { phone }],
		});

		if (existingUser) {
			return res.status(409).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await userModel.create({
			name,
			email,
			phone,
			password: hashedPassword,
		});

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
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function UserLogin(req, res) {
	try {
		const { email, phone, password } = req.body;

		if ((!email && !phone) || !password) {
			return res
				.status(400)
				.json({ message: "Email or phone and password required" });
		}

		const user = await userModel.findOne(email ? { email } : { phone });
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
		const token =
			req.cookies?.token_user || req.headers.authorization?.split(" ")[1];

		if (token) {
			await BlacklistToken.create({ token });
		}

		res.clearCookie("token_user", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});

		return res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}

export async function UserProfile(req, res) {
	try {
		return res.status(200).json(req.user);
	} catch (error) {
		return res.status(500).json({ message: "Internal server error" });
	}
}
