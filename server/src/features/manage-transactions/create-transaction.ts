// src/features/manage-transactions/create-transaction.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { transactionRepository } from "../../entities/transaction/lib/transaction.repository";
import { accountRepository } from "../../entities/account/lib/account.repository";

// 1. Define the Validation Schema
// We strictly type what we accept from the frontend.
const createTransactionSchema = z.object({
    name: z.string().min(1),
    amount: z.number().positive(), // Frontend sends number, we store as Decimal
    type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
    accountId: z.uuid(),
    categoryId: z.uuid(),
    currencyId: z.uuid(),
    date: z.iso.datetime(),
});

export const createTransactionController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate the request body
        const transactionData = createTransactionSchema.parse(req.body);

        const CURRENT_USER_ID = "230fc6dc-4203-43dc-afed-0914a3466742";

        const isOnwer = await accountRepository.verifyOwnership(
            transactionData.accountId,
            CURRENT_USER_ID
        );

        if (!isOnwer) {
            res.status(403).json({
                error: "Access Denied: You do not own this account."
            });

            return;
        }

        if (transactionData.type === "EXPENSE") {
            const currentBalance = await accountRepository.calculateBalance(
                transactionData.accountId
            );

            if (currentBalance < transactionData.amount) {
                res.status(400).json({
                    error: "Insufficient balance",
                    currentBalance: currentBalance,
                    attemptAmount: transactionData.amount
                });

                return;
            }
        }

        // Create the transaction in the DataBase
        const newTransaction = await transactionRepository.create({
            userId: CURRENT_USER_ID,
            ...transactionData
        })

        // Return the new Transaction to the client
        res.status(201).json({
            message: "Transaction created successfully",
            transaction: newTransaction
        })

    } catch (error) {
        next(error); // Pass to global error handler
    }
};