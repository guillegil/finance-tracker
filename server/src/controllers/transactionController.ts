import { Request, Response } from 'express';

// The Interface lives here for now (or in a models folder)
interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  createdAt: string;
}

// Our "In-Memory" Database
let transactions: Transaction[] = [
  { 
    id: 1, 
    description: 'Salary', 
    amount: 5000, 
    type: 'income', 
    category: 'Salary',
    createdAt: new Date().toISOString() 
  }
];

// --- Logic Functions ---

export const getTransactions = (req: Request, res: Response) => {
  res.json(transactions);
};

export const createTransaction = (req: Request, res: Response) => {
  const { description, amount, type, category } = req.body;

  if (!description || !amount || !type) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newTransaction: Transaction = {
    id: Date.now(),
    description,
    amount: Number(amount),
    type,
    category: category || "General",
    createdAt: new Date().toISOString()
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
};

export const deleteTransaction = (req: Request, res: Response) => {
  const idToDelete = Number(req.params.id);
  transactions = transactions.filter(t => t.id !== idToDelete);
  res.json({ message: "Deleted successfully" });
};