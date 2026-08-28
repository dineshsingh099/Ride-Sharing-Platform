import mongoose from "mongoose";

type vehicleType = "bike" | "car" | "auto" | "suv" | "Bus" | "loading";

interface IVehicle {
	owner: mongoose.Types.ObjectId;
	type: vehicleType;
	vehicleModel: string;
	number: string;
	imageURL?: string;
	baseFare?: number;
	pricePerKM?: number;
	waitingCharge?: number;
	status: "approved" | "pending" | "rejected";
	rejectionReason?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const vehicleSchema = new mongoose.Schema<IVehicle>(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			required: true,
		},
		type: {
			type: String,
			enum: ["bike", "car", "auto", "suv", "Bus", "loading"],
			required: true,
		},
		number: {
			type: String,
			required: true,
			unique: true,
		},
		vehicleModel: {
			type: String,
			required: true,
		},

		imageURL: { type: String },
		baseFare: { type: Number },
		pricePerKM: { type: Number },
		waitingCharge: { type: Number },
		status: {
			type: String,
			enum: ["approved", "pending", "rejected"],
			default: "pending",
		},
		rejectionReason: { type: String },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

const Vehicle =
	mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", vehicleSchema);

export default Vehicle;