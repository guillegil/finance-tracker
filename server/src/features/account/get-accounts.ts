import { Request, Response, NextFunction } from "express";
import { accountRepository } from "../../entities/account/lib/account.repository";

export const getAccountsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.headers["x-user-id"] as string;

        const accounts = await accountRepository.findManyByUserId(userId);

        res.status(200).json(
            accounts
        )

    } catch (err) {
        next(err);
    }
}