import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IPartner extends Document {
	name: string;
	email: string;
	password?: string;

	avatar?: string;
	googleId?: string;
	authProvider: "local" | "google";

	isEmailVerified: boolean;
	role: "partner";

	otp?: string;
	otpExpiresAt?: Date;
	otpSentAt?: Date;
	partnerOnBoardingSteps: number;

	createdAt: Date;
	updatedAt: Date;

	comparePassword(candidatePassword: string): Promise<boolean>;
	compareOtp(candidateOtp: string): Promise<boolean>;
}

const partnerSchema = new mongoose.Schema<IPartner>(
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
			enum: ["partner"],
			default: "partner",
		},

		partnerOnBoardingSteps: {
			type: Number,
			min: 0,
			max: 3,
			default: 0,
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

partnerSchema.pre("save", async function () {
	if (this.isModified("password") && this.password) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}

	if (this.isModified("otp") && this.otp) {
		const salt = await bcrypt.genSalt(10);
		this.otp = await bcrypt.hash(this.otp, salt);
	}
});

partnerSchema.methods.comparePassword = async function (
	candidatePassword: string,
): Promise<boolean> {
	if (!this.password) {
		return false;
	}
	return bcrypt.compare(candidatePassword, this.password);
};

partnerSchema.methods.compareOtp = async function (
	candidateOtp: string,
): Promise<boolean> {
	if (!this.otp) {
		return false;
	}
	return bcrypt.compare(candidateOtp, this.otp);
};

const Partner =
	mongoose.models.Partner || mongoose.model<IPartner>("Partner", partnerSchema);

export default Partner;
