import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../utils/validators.js';
import { validate } from '../middlewares/validator.js';

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

export default router;
