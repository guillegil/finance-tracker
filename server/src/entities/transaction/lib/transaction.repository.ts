// src/entities/transaction/lib/transaction.repository.ts
import { db } from "../../../shared/api/db";
import type { Prisma } from "@prisma/client";

export type TransactionFilters = {
    userId: string;
    accountId?: string | undefined;
    limit?: number | undefined;
}

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
                account: {
                    select: {
                        name: true,
                    },
                },
            }
        });
    },

    async findMany(filters: TransactionFilters) {
        return db.transaction.findMany({
            where: {
                userId: filters.userId,
                ...(
                    filters.accountId && { accountId: filters.accountId }
                )
            },

            take: filters.limit || 20,

            include: {
                category: true,
                currency: true,

                account: {
                    select: {
                        name: true,
                    },
                },
            },

            orderBy: {
                date: 'desc'
            },
        })
    },

    /**
     * Finds a transaction by its ID.
     */
    async findById(id: string) {
        return db.transaction.findUnique({ where: { id } });
    }


};