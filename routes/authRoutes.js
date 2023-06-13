import express from 'express';
import validInfo from '../middleware/validInfo.js';
import {register, signin, statusChange, resetPassword} from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/signup',validInfo, register);
router.post('/signin',validInfo, signin)
router.post('/confirm', statusChange)
router.post('/resetPassword', resetPasswordRequestController,
resetPasswordController)

export default router;