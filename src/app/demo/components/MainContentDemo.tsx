// src/app/components/MainContentDemo.tsx
"use client";
import { useEffect, useState } from "react";
import OptionsPanelDemo from "./OptionsPanelDemo";
import InfoPanel from "./InfoPanelDemo";
import ExpensesPanel from "./ExpensesPanelDemo";

interface Transaction {
  title: string;
  addedBy: string;
  forUser: string; // ⬅️ dodaj to pole!
  amount: number;
  type: "REQUIREMENT" | "REPAYMENT";
  date: string;
}

export default function MainContentDemo({ list }: { list: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<"info" | "expenses" | "options">("info");
  const STORAGE_KEY = `demo_transactions_${list}`;

  useEffect(() => {
    const raw = localStorage.getItem("demo_lists");
    if (!raw) return;

    try {
      const all = JSON.parse(raw);
      const current = all[list];
      if (current && Array.isArray(current.transactions)) {
        setTransactions(current.transactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setTransactions([]);
    }
  }, [list]);

  const addTransaction = (
    title: string,
    amount: number,
    forUser: string,
    addedBy: string
  ) => {
    const raw = localStorage.getItem("demo_lists") || "{}";
    const all = JSON.parse(raw);
    const current = all[list] || { users: [], transactions: [] };

    const newTx: Transaction = {
      title,
      amount,
      forUser,
      addedBy,
      type: "REQUIREMENT",
      date: new Date().toISOString().split("T")[0],
    };

    current.transactions.unshift(newTx); // dodaj na początek
    all[list] = current;

    localStorage.setItem("demo_lists", JSON.stringify(all));
    setTransactions(current.transactions);
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
        {["info", "expenses", "options"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as any)}
            className={`w-1/3 text-center py-2 font-semibold border-b-2 transition ${
              view === v
                ? "border-black text-black"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {v === "info"
              ? "More info"
              : v === "expenses"
              ? "Expenses"
              : "Options"}
          </button>
        ))}
      </div>

      {view === "info" && (
        <InfoPanel
          key={view} // <- to wymusi ponowne uruchomienie useEffect w InfoPanel
          transactions={transactions}
          onAddTransaction={addTransaction}
          onEdit={() => alert("Edit mode not implemented yet")}
          list={list}
        />
      )}

      {view === "expenses" && <ExpensesPanel />}
      {view === "options" && <OptionsPanelDemo list={list} />}
    </section>
  );
}
