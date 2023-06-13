import express from 'express';
import validInfo from '../middleware/validInfo.js';
import {register, signin, statusChange, requestPasswordReset, verifyToken, resetPasword} from '../controllers/auth.controller.js';
import {translatorRegister, translatorSignin, translatorStatusChange, requestTranslatorPasswordReset,verifyTranslatorToken, resetTranslatorPasword} from '../controllers/translator.auth.controller.js';
const router = express.Router();
router.post('/user/signup',validInfo, register);
router.post('/user/signin',validInfo, signin)
router.post('/user/confirm', statusChange)
router.post('/user/requestPasswordReset', requestPasswordReset)
router.post('/user/tokenVerification', verifyToken)
router.post('/user/resetPassword', resetPasword)
router.post('/translator/signup',validInfo, translatorRegister);
router.post('/translator/signin',validInfo, translatorSignin)
router.post('/translator/confirm', translatorStatusChange)
router.post('/translator/requestPasswordReset', requestTranslatorPasswordReset)
router.post('/translator/tokenVerification', verifyTranslatorToken)
router.post('/translator/resetPassword', resetTranslatorPasword)


export default router;