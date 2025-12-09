// src/entities/account/lib/account.repository.ts
import { db } from "../../../shared/api/db";
import { Prisma } from "@prisma/client";

export type AccountFilter = {
  userId: string,
  accountId: string,

}


export const accountRepository = {
  /**
   * Checks if an account exists and belongs to a specific user.
   */
  async verifyOwnership(accountId: string, userId: string): Promise<boolean> {
    const count = await db.account.count({
      where: {
        id: accountId,
        userId: userId,
      },
    });
    return count > 0;
  },

  /**
   * Creates a new account for a specific user.
   */
  async create(data: Prisma.AccountUncheckedCreateInput) {
    return db.account.create({ data });
  },

  async findManyByUserId(userId: string) {
    const accounts = await db.account.findMany({
      where: {
        userId: userId,
      },
      include: {
        currency: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const accountsWithBalance = await Promise.all(
      accounts.map(async (acc) => {
        const balance = await accountRepository.calculateBalance(acc.id);
        return {
          ...acc,
          balance: balance,
        }
      })
    );

    return accountsWithBalance;
  },

  /**
   * Calculates the current balance dynamically.
   * Formula: (Total Income) - (Total Expenses)
   */
  async calculateBalance(accountId: string): Promise<number> {
    // Group transactions by type to sum them up in one query
    const aggregations = await db.transaction.groupBy({
      by: ["type"],
      where: { accountId },
      _sum: { amount: true },
    });

    let balance = 0;

    // Iterate through the results (Income vs Expense)
    for (const group of aggregations) {
      const amount = group._sum.amount?.toNumber() || 0; // Convert Decimal to JS Number

      if (group.type === "INCOME") {
        balance += amount;
      } else if (group.type === "EXPENSE") {
        balance -= amount;
      }
      // Transfers logic would go here (complex, skipping for MVP)
    }

    return balance;
  },
};