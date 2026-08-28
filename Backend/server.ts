import dotenv from "dotenv";
dotenv.config({ quiet: true });
import app from "./src/app";
import connectDB from "./src/config/db";

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(
				`Server is running on \x1b[34mhttp://localhost:${PORT}\x1b[0m | Environment: \x1b[33m${NODE_ENV}\x1b[0m`,
			);
		});
	})
	.catch((error) => {
		console.error(`\x1b[31mDB Connection Failed: ${error.message}\x1b[0m`);
		process.exit(1);
	});

process.on("uncaughtException", (error) => {
	console.error(`\x1b[31mUncaught Exception: ${error.message}\x1b[0m`);
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	console.error(`\x1b[31mUnhandled Rejection:\x1b[0m`, reason);
	process.exit(1);
});
