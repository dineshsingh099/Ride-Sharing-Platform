import mongoose, { Connection } from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
	throw new Error("MONGO_URI not found in environment variables");
}

let cached = global.mongooseConn;

if (!cached) {
	cached = global.mongooseConn = { conn: null, promise: null };
}

const connectDB = async (): Promise<Connection> => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGO_URI).then((c) => {
			console.log("MongoDB connected successfully");
			return c.connection;
		});
	}

	try {
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (error) {
		cached.promise = null;
		throw error;
	}
};

export default connectDB;
