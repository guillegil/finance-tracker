// src/app/routes.ts
import { Router } from "express";
import { createTransactionController } from "../features/manage-transactions/create-transaction";
import { getTransactionsController } from "../features/manage-transactions/get-transasctions";

const router = Router();

// Feature: Manage Transactions
// We group routes by feature domain
router.post("/transactions", createTransactionController);
router.get("/transactions", getTransactionsController);

// Future routes will go here:
// router.get("/transactions", getTransactionsController);
// router.delete("/transactions/:id", deleteTransactionController);

export { router };