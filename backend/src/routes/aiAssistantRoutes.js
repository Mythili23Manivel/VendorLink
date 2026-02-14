import express from 'express';
import { queryAssistant } from '../controllers/aiAssistantController.js';
import { protect } from '../middlewares/auth.js';
import { body } from 'express-validator';
import { validate } from '../middlewares/validator.js';

const router = express.Router();

router.use(protect);
router.post('/query', body('query').notEmpty().withMessage('Query is required'), validate, queryAssistant);

export default router;
