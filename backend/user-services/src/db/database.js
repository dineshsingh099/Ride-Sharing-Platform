import mongoose from "mongoose";

async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGO_URI);

		console.log("✅ Database connection established successfully.");
	} catch (error) {
		console.error("❌ Failed to connect to MongoDB:");
		console.error(`Error Details: ${error.message}`);
		process.exit(1);
	}
}

export default connectDB;
