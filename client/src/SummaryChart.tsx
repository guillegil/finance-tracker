import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
}

interface Props {
    transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function SummaryChart({ transactions }: Props) {

    // 1. DATA TRANSFORMATION
    // We need to turn: [{ cat: 'Food', amt: 10 }, { cat: 'Food', amt: 20 }]
    // Into: [{ name: 'Food', value: 30 }]
    const data = useMemo(() => {
        // Only chart "Expenses" for now
        const expenses = transactions.filter(t => t.type === 'expense');

        const grouped = expenses.reduce((acc, curr) => {
            // If category exists, add to it. If not, create it.
            if (acc[curr.category]) {
                acc[curr.category] += curr.amount;
            } else {
                acc[curr.category] = curr.amount;
            }
            return acc;
        }, {} as Record<string, number>);

        // Convert Object back to Array for Recharts
        return Object.keys(grouped).map(key => ({
            name: key,
            value: grouped[key]
        }));
    }, [transactions]);

    if (data.length === 0) return <p>No expenses to show</p>;

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h3>Expense Breakdown</h3>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} // Makes it a "Donut" chart
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}