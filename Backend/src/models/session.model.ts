import mongoose, { Document, Types, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface ISession extends Document {
	userId: Types.ObjectId;
	role: "user" | "partner" | "admin";
	token: string;

	device?: string;
	ipAddress?: string;
	userAgent?: string;
	expiresAt: Date;

	createdAt: Date;
	updatedAt: Date;

	compareToken(candidateToken: string): Promise<boolean>;
}

interface ISessionModel extends Model<ISession> {
	findMatchingSession(
		userId: string,
		role: "user" | "partner" | "admin",
		candidateToken: string,
	): Promise<ISession | null>;
}

const sessionSchema = new mongoose.Schema<ISession>(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		role: {
			type: String,
			enum: ["user", "partner", "admin"],
			required: true,
		},
		token: {
			type: String,
			required: true,
		},

		device: {
			type: String,
			default: "web",
		},

		ipAddress: {
			type: String,
			default: "",
		},

		userAgent: {
			type: String,
			default: "",
		},

		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

sessionSchema.pre("save", async function () {
	if (!this.isModified("token")) {
		return;
	}
	const salt = await bcrypt.genSalt(10);
	this.token = await bcrypt.hash(this.token, salt);
});

sessionSchema.methods.compareToken = async function (
	candidateToken: string,
): Promise<boolean> {
	return bcrypt.compare(candidateToken, this.token);
};

sessionSchema.statics.findMatchingSession = async function (
	userId: string,
	role: "user" | "partner" | "admin",
	candidateToken: string,
) {
	const sessions = await this.find({ userId, role });
	for (const session of sessions) {
		if (await session.compareToken(candidateToken)) {
			return session;
		}
	}
	return null;
};

const Session =
	(mongoose.models.Session as ISessionModel) ||
	mongoose.model<ISession, ISessionModel>("Session", sessionSchema);

export default Session;
