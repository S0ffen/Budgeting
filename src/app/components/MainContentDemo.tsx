"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Transaction {
  title: string;
  addedBy: string;
  amount: number;
  type: "REQUIREMENT" | "REPAYMENT";
  date: string;
}

export default function MainContentDemo({ list }: { list: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const STORAGE_KEY = `demo_transactions_${list}`;

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    setTransactions(parsed);
  }, [list]);

  const addTransaction = () => {
    if (!newTitle.trim() || !newAmount.trim()) return;

    const newTx: Transaction = {
      title: newTitle,
      addedBy: "Sophia",
      amount: parseFloat(newAmount),
      type: "REQUIREMENT",
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [...transactions, newTx];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setTransactions(updated);
    setNewTitle("");
    setNewAmount("");
    setShowAdd(false);
  };

  return (
    <section className="flex-1 p-8">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">List: {list}</h2>
        <nav className="flex gap-6 text-gray-600 font-medium">
          <a href="#">Home</a>
          <a href="#">Create List</a>
          <a href="#">About us</a>
        </nav>
      </header>

      <div className="flex border-b border-gray-300 mb-4">
        <button className="w-1/2 text-center py-2 border-b-2 border-black font-semibold">
          More info
        </button>
        <button className="w-1/2 text-center py-2 text-gray-500">
          Expenses
        </button>
        <button className="w-1/2 text-center py-2 text-gray-500">
          Options
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {transactions.map((tx, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white p-4 rounded shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div>
                <div className="font-semibold">{tx.title}</div>
                <div className="text-sm text-gray-500">
                  {tx.date} • Added by {tx.addedBy}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="uppercase text-sm text-gray-500">{tx.type}</div>
              <div className="text-lg font-bold">${tx.amount.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between gap-4">
        <button
          className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded font-semibold"
          onClick={() => alert("Edit mode not implemented yet")}
        >
          Edit items
        </button>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <button className="flex-1 bg-teal-200 hover:bg-teal-300 py-3 rounded font-semibold">
              Add item
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new list</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-2"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="mb-4"
            />
            <Button onClick={addTransaction}>Add</Button>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
