import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: [3, "Name must be at least 3 characters long"],
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [/.+\@.+\..+/, "Please fill a valid email address"],
		},
		phone: {
			type: String,
			required: true,
			unique: true,
			minlength: [10, "Phone number must be at least 10 digits long"],
		},
		password: {
			type: String,
			required: true,
			select: false,
			minlength: [6, "Password must be at least 6 characters long"],
		},

		isAccountVerified: {
			type: Boolean,
			default: false,
		},
		verifyOtp: {
			type: String,
			default: "",
		},
		verifyOtpExpiryAt: {
			type: Date,
			default: null,
		},

		resetOtp: { type: String, default: "" },
		resetOtpExpiryAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
