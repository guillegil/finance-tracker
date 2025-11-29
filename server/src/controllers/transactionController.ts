import { Request, Response } from 'express';
import { prisma } from '../db'; // Import our new DB connection

// GET: Fetch all transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' } // Sort by newest first
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
};

// POST: Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  const { description, amount, type, category } = req.body;

  // Basic Validation
  if (!description || !amount || !type) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: Number(amount),
        type,
        category: category || "General"
      }
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: "Error saving data" });
  }
};

// DELETE: Remove a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  const idToDelete = Number(req.params.id);

  try {
    await prisma.transaction.delete({
      where: { id: idToDelete }
    });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting data" });
  }
};