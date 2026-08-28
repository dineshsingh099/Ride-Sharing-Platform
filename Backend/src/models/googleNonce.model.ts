import mongoose, { Document, Model } from "mongoose";

export interface IGoogleNonce extends Document {
	hashedNonce: string;
	role: "user" | "partner";
	expiresAt: Date;
	createdAt: Date;
}

const googleNonceSchema = new mongoose.Schema<IGoogleNonce>(
	{
		hashedNonce: {
			type: String,
			required: true,
			unique: true,
		},
		role: {
			type: String,
			enum: ["user", "partner"],
			required: true,
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

googleNonceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const GoogleNonce =
	(mongoose.models.GoogleNonce as Model<IGoogleNonce>) ||
	mongoose.model<IGoogleNonce>("GoogleNonce", googleNonceSchema);

export default GoogleNonce;
