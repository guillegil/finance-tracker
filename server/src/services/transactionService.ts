import { prisma } from '../db';
import { TransactionType } from '@prisma/client';

export class TransactionService {

    /**
     * Fetch all transactions for a specific user.
     * Optimized to fetch strictly what the UI needs.
     */
    static async getTransactions(userId: string) {
        return await prisma.transaction.findMany({
            where: { userId },
            include: {
                account: {
                    select: { name: true }
                },
                category: {
                    select: { name: true, avatar: true }
                },
                currency: {
                    select: { symbol: true, code: true }
                }
            },
            orderBy: { date: 'desc' }
        });
    }

    /**
     * Create a basic INCOME or EXPENSE transaction.
     */
    static async createTransaction(data: {
        userId: string;
        amount: number;
        type: TransactionType;
        name: string;
        description?: string;
        date: string;
        accountId: string;
        categoryId?: string;
        currencyId: string;
        destAccountId?: string;
    }) {

        if (data.amount <= 0) {
            throw new Error("Amount must be positive");
        }

        return await prisma.transaction.create({
            data: {
                userId: data.userId,
                amount: data.amount,
                type: data.type,
                name: data.name,
                description: data.description ?? null,
                date: new Date(data.date),
                accountId: data.accountId,
                categoryId: data.categoryId ?? null,
                currencyId: data.currencyId,
            },
        });
    }

    /**
     * Delete a transaction safely (ensuring ownership)
     */
    static async deleteTransaction(id: string, userId: string) {
        return await prisma.transaction.delete({
            where: {
                id,
                userId
            }
        });
    }
}