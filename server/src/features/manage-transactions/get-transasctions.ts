// src/features/manage-transactions/create-transaction.ts
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { transactionRepository } from "../../entities/transaction/lib/transaction.repository";

const getTransactionsSchema = z.object({
    accountId: z.uuid().optional(),
    limit: z.coerce.number().min(1).optional().default(20)
});

export const getTransactionsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const transactionsFilter = getTransactionsSchema.parse(req.query);

        const userId = req.headers["x-user-id"] as string;

        const filteredTransactions = await transactionRepository.findMany({
            userId,
            accountId: transactionsFilter.accountId,
            limit: transactionsFilter.limit,
        });

        return res.status(200).json({
            count: filteredTransactions.length,
            data: filteredTransactions
        });
    } catch (error) {
        next(error);
    }
}
