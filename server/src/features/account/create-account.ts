import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { accountRepository } from "../../entities/account/lib/account.repository";

const createAccountSchema = z.object({
    name: z.string(),
    iban: z.string().optional().nullable().default(null),
    currencyId: z.string(),
    isMain: z.boolean().optional().default(false),
});


export const createAccountController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const accountData = createAccountSchema.parse(req.body)

        const userId = req.headers["x-user-id"] as string;

        const newAccount = await accountRepository.create({
            userId,
            ...accountData
        });

        res.status(201).json({
            message: "Account created successfully",
            data: newAccount,
        })

    } catch (error) {
        next(error);
    }


}