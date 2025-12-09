import { Request, Response, NextFunction } from "express";

export const mockAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Look for the header 'x-user-id'
    const userId = req.headers["x-user-id"] as string;

    // 2. If present, inject it into the request object
    if (userId) {
        req.headers["x-user-id"] = userId;
        console.log(`🔑 Mock Auth: Identifing as User ${userId}`);
        next(); // Pass control to the next handler (Controller)
    } else {
        // 3. If missing, block the request (Enforce Security)
        res.status(401).json({ error: "Unauthorized: Missing x-user-id header" });
        return;
    }
};