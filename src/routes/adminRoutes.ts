import { Router } from 'express';
import {
  getOperators,
  createOperator,
  updateOperator,
  deleteOperator,
  updateCommissions,
  updateLimits
} from '../controllers/adminController';

const router = Router();

// Operateurs
router.get('/operators', getOperators);
router.post('/operators', createOperator);
router.put('/operators/:id', updateOperator);
router.delete('/operators/:id', deleteOperator);

// Parametres
router.put('/config/commissions', updateCommissions);
router.put('/config/limits', updateLimits);

export default router;
