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

        console.log(transactionsFilter);

        // Mock user for now
        const CURRENT_USER_ID = "230fc6dc-4203-43dc-afed-0914a3466742";

        const filteredTransactions = await transactionRepository.findMany({
            userId: CURRENT_USER_ID,
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
