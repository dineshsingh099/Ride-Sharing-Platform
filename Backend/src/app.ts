import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from "helmet";
import cookieParser from 'cookie-parser'

import authRoutes from "./routes/user.routes"
import partnerRoutes from "./routes/partner.routes"
import adminRoutes from "./routes/admin.routes"

const app = express()
app.use(helmet());
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
	}),
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("Server is running");
});

app.use("/api/user", authRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/admin", adminRoutes);


export default app