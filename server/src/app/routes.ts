// src/app/routes.ts
import { Router } from "express";
import { createTransactionController } from "../features/manage-transactions/create-transaction";

const router = Router();

// Feature: Manage Transactions
// We group routes by feature domain
router.post("/transactions", createTransactionController);

// Future routes will go here:
// router.get("/transactions", getTransactionsController);
// router.delete("/transactions/:id", deleteTransactionController);

export { router };