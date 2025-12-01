// routes/customerRoutes.js
import express from 'express';
import {
  getCustomers,
  getCustomerById,
  blockCustomer,
  unblockCustomer,
  syncCustomerFromUserApp
} from '../controllers/customerController.js';

const router = express.Router();

// list with filter/pagination
router.get('/getCustomers', getCustomers);

// single customer
router.get('/:id', getCustomerById);

// block / unblock
router.patch('/:id/block', blockCustomer);
router.patch('/:id/unblock', unblockCustomer);


router.post('/sync', syncCustomerFromUserApp);




export default router;
