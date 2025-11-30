import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: [3, "Name must be at least 3 characters long"]
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	
	phone: {
		type: String,
		required: true,
		unique: true,
		minlength: [10, "Phone number must be at least 10 digits long"]
	},
	password: {
		type: String,
		required: true,
		select: false,
		minlength: [6, "Password must be at least 6 characters long"]
	}
	
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
