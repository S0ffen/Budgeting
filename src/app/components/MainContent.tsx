"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Transaction {
  user: string;
  title: string;
  amount: number;
  created_at: string;
}

interface MainContentProps {
  selectedUser: string | null;
}

export default function MainContent({ selectedUser }: MainContentProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const today = new Date().toISOString().split("T")[0];

  // 📥 Fetch na start
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase.from("Objects").select();

      if (error) {
        console.error("Fetch error:", error);
      } else {
        const parsed = data.map((item: Transaction) => ({
          user: item.user,
          title: item.title,
          amount: item.amount,
          created_at: item.created_at?.split("T")[0] || "",
        }));
        setTransactions(parsed);
      }

      console.log("Fetched transactions:", data);
      console.log("Supabase fetch error:", error);
      console.log("Supabase fetched data:", data);

      console.log("Parsed transactions:", transactions);
    };

    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !title || !amount) return;

    const { data, error } = await supabase.from("Objects").insert([
      {
        user: selectedUser,
        title,
        amount: parseFloat(amount),
      },
    ]);
    if (error) {
      console.error("Insert error:", error);
      return;
    }
    console.log("Inserted transaction:", data);

    setTransactions((prev) => [
      ...prev,
      {
        user: selectedUser,
        title,
        amount: parseFloat(amount),
        created_at: today,
      },
    ]);

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
        <Button
          type="submit"
          disabled={!selectedUser}
          className="rounded disabled:opacity-50"
        >
          Add Transaction
        </Button>
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
              <td className="p-2 border">{tx.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
