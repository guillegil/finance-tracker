// src/app/server.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { router } from "./routes";
import morgan from "morgan";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Mount the FSD Router
// All feature routes will be prefixed with /api
app.use("/api", router);

// Global Error Handler (FSD: This usually lives in shared/api/error-handler, but inline for now is fine)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    // Handle Zod Validation Errors nicely
    if (err.name === "ZodError") {
        res.status(400).json({ error: "Validation Error", details: err.issues });
        return; // Explicit return to stop execution
    }

    res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});