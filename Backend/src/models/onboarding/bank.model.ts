import mongoose from "mongoose";

interface IPartnerBank {
	owner: mongoose.Types.ObjectId;
	accountHolderName: string;
	accountNumber: string;
	ifscCode: string;
	phoneNumber: string;
	upiId?: string;
	status: "not_added" | "added" | "verified";
	createdAt: Date;
	updatedAt: Date;
}

const partnerBankSchema = new mongoose.Schema<IPartnerBank>(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Partner",
			required: true,
		},
		accountHolderName: {
			type: String,
			required: true,
		},
		accountNumber: {
			type: String,
			required: true,
			unique: true,
		},
		ifscCode: {
			type: String,
			required: true,
			uppercase: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		upiId: {
			type: String,
		},
		status: {
			type: String,
			enum: ["not_added", "added", "verified"],
			default: "not_added",
		},
	},
	{ timestamps: true },
);

const PartnerBank =
	mongoose.models.PartnerBank ||
	mongoose.model<IPartnerBank>("PartnerBank", partnerBankSchema);

export default PartnerBank;
