// src/entities/transaction/lib/transaction.repository.ts
import { db } from "../../../shared/api/db";
import type { Prisma } from "@prisma/client";

export const transactionRepository = {
    /**
     * Persists a new transaction to the database.
     * @param data - The raw data required by Prisma to create a transaction
     */
    async create(data: Prisma.TransactionUncheckedCreateInput) {
        return db.transaction.create({
            data,
            include: {
                category: true,
                currency: true,
                account: true,
            }
        });
    },

    /**
     * Finds a transaction by its ID.
     */
    async findById(id: string) {
        return db.transaction.findUnique({ where: { id } });
    }
};