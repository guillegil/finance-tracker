import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import './App.css';
import SummaryChart from './SummaryChart';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  createdAt: string;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FORM STATE (The "Buffer" for user input) ---
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [type, setType] = useState<"income" | "expense">("expense");

  // Fetch Data (Same as before)
  useEffect(() => {
    fetch('http://localhost:3000/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setIsLoading(false);
      });
  }, []);

  // --- SUBMIT HANDLER (The "Write" Operation) ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // 1. Stop the browser from refreshing the page

    if (!description || !amount) return; // Simple validation

    const newTransaction = {
      description,
      amount: Number(amount), // Convert string "50" to number 50
      type,
      category: category // Hardcoded for MVP
    };

    try {
      // 2. Send POST request
      const response = await fetch('http://localhost:3000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });

      if (response.ok) {
        const savedTransaction = await response.json();

        // 3. Update UI (Optimistic update or Append result)
        setTransactions([...transactions, savedTransaction]);

        // 4. Reset Form
        setDescription("");
        setAmount("");
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  // --- DELETE HANDLER ---
  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/transactions/${id}`, { method: 'DELETE' });
      // Filter out the deleted item from the local state
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const balance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  return (
    <div className="app-container">
      <h1>💰 Finance Tracker</h1>

      <div className="balance-card">
        <h2>Current Balance</h2>
        <span className={balance >= 0 ? 'positive' : 'negative'}>
          ${balance.toFixed(2)}
        </span>
      </div>


      {/* --- NEW: ADD TRANSACTION FORM --- */}
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Description (e.g., Rent)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Groceries">Groceries</option>
            <option value="Rent">Rent</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Salary">Salary</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Add Transaction</button>
      </form>

      <SummaryChart transactions={transactions} />

      <div className="transaction-list">
        <h3>History</h3>
        {isLoading ? <p>Loading...</p> : (
          <ul>
            {transactions.map((t) => (
              <li key={t.id} className={`transaction-item ${t.type}`}>
                <div className="info">
                  <span className="desc">{t.description}</span>
                  <span className="category">{t.category}</span>
                </div>
                <div className="actions">
                  <span className="amount">
                    {t.type === 'expense' ? '-' : '+'}${t.amount}
                  </span>
                  {/* Delete Button */}
                  <button onClick={() => handleDelete(t.id)} className="delete-btn">×</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;