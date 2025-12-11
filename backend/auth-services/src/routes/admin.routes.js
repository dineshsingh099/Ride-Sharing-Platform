import express from 'express';
import { registerAdmin,loginAdmin, logoutAdmin,getAdminProfile} from '../controllers/admin.controller.js';
import { AdminAuthMiddleware } from '../middlewares/authMiddleware.js';

const adminRouter = express.Router();

adminRouter.post('/register', registerAdmin);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/logout', AdminAuthMiddleware, logoutAdmin);
adminRouter.get('/profile', AdminAuthMiddleware,getAdminProfile);


export default adminRouter;