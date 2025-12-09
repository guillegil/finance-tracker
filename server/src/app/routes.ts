// src/app/routes.ts
import { Router } from "express";

// Transaction features imports
import { createTransactionController } from "../features/manage-transactions/create-transaction";
import { getTransactionsController } from "../features/manage-transactions/get-transasctions";

// Account feature imports
import { createAccountController } from "../features/account/create-account";
import { getAccountsController } from "../features/account/get-accounts";

const router = Router();

// Feature: Manage Transactions
// We group routes by feature domain
router.post("/transactions", createTransactionController);
router.get("/transactions", getTransactionsController);

router.post("/accounts", createAccountController);
router.get("/accounts", getAccountsController);

// Future routes will go here:
// router.get("/transactions", getTransactionsController);
// router.delete("/transactions/:id", deleteTransactionController);

export { router };