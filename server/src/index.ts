import express from 'express';
import cors from 'cors';
import transactionRoutes from './routes/transactionRoutes';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// We mount the router at '/api/transactions'. 
// This means all routes inside that file automatically get this prefix.
app.use('/api/transactions', transactionRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});