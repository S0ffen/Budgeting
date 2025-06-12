/*
  Finalny MainContent: wybór użytkownika z listy (prop), wpisanie danych (tytuł, kwota, data = dzisiaj) i dodanie do tabeli poniżej
*/

"use client";

import { useState } from "react";

interface Transaction {
  user: string;
  title: string;
  amount: number;
  date: string;
}

interface MainContentProps {
  selectedUser: string | null;
}

export default function MainContent({ selectedUser }: MainContentProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !title || !amount) return;
    const newTransaction: Transaction = {
      user: selectedUser,
      title,
      amount: parseFloat(amount),
      date: today,
    };
    setTransactions([...transactions, newTransaction]);
    setTitle("");
    setAmount("");
  };

  return (
    <div className="flex-1 w-full bg-blue-100 border border-black m-4 p-4">
      <h2 className="text-lg font-bold mb-4">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="font-medium">Selected User:</label>
          <input
            type="text"
            value={selectedUser || ""}
            disabled
            className="bg-blue-300 border border-black p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-blue-200 border border-black p-2 rounded"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-medium">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-blue-200 border border-black p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={!selectedUser}
          className="px-4 py-2 bg-blue-400 text-black rounded disabled:opacity-50"
        >
          Add Transaction
        </button>
      </form>

      <h2 className="text-lg font-bold mt-8 mb-2">Transactions</h2>
      <table className="w-full text-left borderborder-black ">
        <thead>
          <tr className="bg-blue-200">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, idx) => (
            <tr key={idx}>
              <td className="p-2 border">{tx.user}</td>
              <td className="p-2 border">{tx.title}</td>
              <td className="p-2 border">{tx.amount.toFixed(2)}</td>
              <td className="p-2 border">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
