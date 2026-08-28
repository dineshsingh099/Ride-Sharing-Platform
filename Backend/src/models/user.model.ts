import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
	name: string;
	email: string;
	password?: string;

	avatar?: string;
	googleId?: string;
	authProvider: "local" | "google";

	isEmailVerified: boolean;
	role: "user" | "admin";

	otp?: string;
	otpExpiresAt?: Date;
	otpSentAt?: Date;

	createdAt: Date;
	updatedAt: Date;

	comparePassword(candidatePassword: string): Promise<boolean>;
	compareOtp(candidateOtp: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			select: false,
		},

		avatar: {
			type: String,
			default: "",
		},

		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},

		authProvider: {
			type: String,
			enum: ["local", "google"],
			default: "local",
		},

		isEmailVerified: {
			type: Boolean,
			default: false,
		},

		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},

		otp: {
			type: String,
			select: false,
		},
		otpExpiresAt: {
			type: Date,
		},
		otpSentAt: {
			type: Date,
		},
	},

	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (this.isModified("password") && this.password) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}

	if (this.isModified("otp") && this.otp) {
		const salt = await bcrypt.genSalt(10);
		this.otp = await bcrypt.hash(this.otp, salt);
	}
});

userSchema.methods.comparePassword = async function (
	candidatePassword: string,
): Promise<boolean> {
	if (!this.password) {
		return false;
	}
	return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.compareOtp = async function (
	candidateOtp: string,
): Promise<boolean> {
	if (!this.otp) {
		return false;
	}
	return bcrypt.compare(candidateOtp, this.otp);
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
