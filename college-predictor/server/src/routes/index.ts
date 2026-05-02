import { Router } from 'express';
import {
  handlePredict,
  handleFilters,
  handleHealth,
} from '../controllers/predict-controller.js';
import { validatePredictQuery } from '../utils/validation.js';

const router = Router();

router.get('/predict', validatePredictQuery, handlePredict);
router.get('/filters', handleFilters);
router.get('/health', handleHealth);

export default router;
