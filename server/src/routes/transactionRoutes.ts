import { Router } from 'express';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController';

const router = Router();

// Define the mapping
router.get('/', getTransactions);       // GET /api/transactions
router.post('/', createTransaction);    // POST /api/transactions
router.delete('/:id', deleteTransaction); // DELETE /api/transactions/:id

export default router;