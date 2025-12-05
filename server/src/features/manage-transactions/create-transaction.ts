// src/features/manage-transactions/create-transaction.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { transactionRepository } from "../../entities/transaction/lib/transaction.repository";

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

        // Create the transaction in the DataBase
        const newTransaction = await transactionRepository.create({
            userId: "9c889818-a256-4e7d-98da-0af82680c45a", // Mock user ID
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