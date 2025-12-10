import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/db/database.js";

connectDB();

const server = http.createServer(app);

const Port = process.env.PORT || 3000;

server.listen(Port, () => {
	console.log(`Auth service is running on port ${Port}`);
});
