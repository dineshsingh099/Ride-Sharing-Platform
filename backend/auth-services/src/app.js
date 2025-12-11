import express from 'express';
import userRoutes from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users',userRoutes);
app.use('/admin',adminRouter);

export default app;