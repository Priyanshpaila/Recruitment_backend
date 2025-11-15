import { Router } from 'express';
import { register, login, logout, changePassword} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const r = Router();
r.post('/register', register);
r.post('/login',    login);
r.post('/logout',   requireAuth, logout);
r.post('/change-password', requireAuth, changePassword);

export default r;
