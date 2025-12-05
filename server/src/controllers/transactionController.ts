import { Request, Response } from 'express';
import { TransactionService } from '../services/transactionService';

// --- CONTROLLERS ---

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    if (!userId) {
      return res.status(400).json({ error: "User ID header is required" });
    }

    const transactions = await TransactionService.getTransactions(userId);
    res.json(transactions);
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { amount, type, name, description, date, accountId, categoryId, currencyId, destAccountId } = req.body;

    // Basic Validation of required fields
    if (!userId || !amount || !type || !name || !accountId || !currencyId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTransaction = await TransactionService.createTransaction({
      userId,
      amount: Number(amount),
      type,
      name,
      description,
      date: date || new Date().toISOString(),
      accountId,
      categoryId,
      currencyId,
      destAccountId: destAccountId ?? null
    });

    res.status(201).json(newTransaction);
  } catch (error: any) {
    console.error("Create Error:", error);
    // Handle our custom Business Logic errors
    if (error.message === "Amount must be positive" ||
      error.message === "Destination account is required for transfers" ||
      error.message === "Cannot transfer to the same account") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Error creating transaction" });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    await TransactionService.deleteTransaction(id, userId);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete transaction" });
  }
};