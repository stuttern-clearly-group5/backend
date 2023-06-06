import express from 'express';
import validInfo from '../middleware/validInfo.js';
import {register, signin} from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/signup',validInfo, register);
router.post('/signin',validInfo, signin)
//router.get('/confirm/:confirmationCode', validInfo, signin)

export default router;