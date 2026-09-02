import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
	name: string;
	email: string;
	password?: string;

	avatar?: string;
	role: "admin";

	isEmailVerified: boolean;

	createdAt: Date;
	updatedAt: Date;

	comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema<IAdmin>(
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
			required: true,
			select: false,
		},

		avatar: {
			type: String,
			default: "",
		},

		role: {
			type: String,
			enum: ["admin"],
			default: "admin",
		},

		isEmailVerified: {
			type: Boolean,
			default: true,
		},
	},

	{ timestamps: true },
);

adminSchema.pre("save", async function () {
	if (this.isModified("password") && this.password) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
});

adminSchema.methods.comparePassword = async function (
	candidatePassword: string,
): Promise<boolean> {
	if (!this.password) {
		return false;
	}
	return bcrypt.compare(candidatePassword, this.password);
};

const Admin =
	mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
