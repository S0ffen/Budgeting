// src/app/components/MainContentDemo.tsx
"use client";
import { use, useEffect, useState } from "react";
import OptionsPanelDemo from "./OptionsPanelDemo";
import InfoPanel from "./InfoPanelDemo";
import ExpensesPanel from "./ExpensesPanelDemo";

interface Transaction {
  title: string;
  addedBy: string;
  forUser: string;
  amount: number;
  category: string;
  date: string; // format: "YYYY-MM-DD"
}

export default function MainContentDemo({
  selectedList,
  setAvailableLists,
  setSelectList,
}: {
  selectedList: string;
  setAvailableLists: (lists: string[]) => void;
  setSelectList: (list: string) => void;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<"info" | "expenses" | "options">("info");

  const [currency, setCurrency] = useState("USD");

  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth());
  const [filterYear, setFilterYear] = useState<number>(
    new Date().getFullYear()
  );
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  // Wczytywanie zawartośći listy z localStorage
  useEffect(() => {
    if (!selectedList) return;

    const raw = localStorage.getItem("demo_lists");
    if (!raw) return;

    try {
      const all = JSON.parse(raw);
      const current = all[selectedList];
      setTransactions(current.transactions);
      setCurrency(current.currency || "USD");
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setTransactions([]);
    }
  }, [selectedList]);

  //Ustawienie waluty
  useEffect(() => {
    //fallback
    if (!selectedList || !currency) return;

    const raw = localStorage.getItem("demo_lists");
    if (!raw) return;
    try {
      const all = JSON.parse(raw);
      const current = all[selectedList];
      current.currency = currency;
      localStorage.setItem("demo_lists", JSON.stringify(all));
    } catch (err) {
      console.error("Failed to load currency:", err);
    }
  }, [currency]);

  // Filtrowanie transakcji wg miesiąca i roku
  useEffect(() => {
    const filtered = transactions.filter((tx) => {
      const [year, month] = tx.date.split("-").map(Number);
      return year === filterYear && month - 1 === filterMonth;
    });
    setFilteredTransactions(filtered);
  }, [transactions, filterMonth, filterYear]);

  const addTransaction = (
    title: string,
    amount: number,
    forUser: string,
    addedBy: string,
    category: string
  ) => {
    if (!selectedList) return;

    const raw = localStorage.getItem("demo_lists") || "{}";
    const all = JSON.parse(raw);

    let current = all[selectedList];

    if (typeof current === "string") {
      try {
        current = JSON.parse(current);
      } catch {
        current = null;
      }
    }

    if (typeof current !== "object" || current === null) {
      current = { users: [], transactions: [] };
    }

    const newTx: Transaction = {
      title,
      amount,
      forUser,
      category,
      addedBy,
      date: new Date().toISOString().split("T")[0],
    };

    console.log("Adding transaction:", newTx);

    (current.transactions ??= []).unshift(newTx);
    all[selectedList] = current;

    localStorage.setItem("demo_lists", JSON.stringify(all));
    setTransactions(current.transactions);
  };
  const editTransaction = (index: number, updated: Partial<Transaction>) => {
    const raw = localStorage.getItem("demo_lists");
    if (!raw) return;

    const all = JSON.parse(raw);
    const current = all[selectedList];

    if (!current || !Array.isArray(current.transactions)) return;

    const oldTx = current.transactions[index];
    const updatedTx = {
      ...oldTx,
      ...updated,
      date: oldTx.date, // zachowujemy datę oryginalną
    };

    current.transactions[index] = updatedTx;
    all[selectedList] = current;

    localStorage.setItem("demo_lists", JSON.stringify(all));
    setTransactions([...current.transactions]);
  };

  const deleteTransaction = (index: number) => {
    const raw = localStorage.getItem("demo_lists");
    if (!raw) return;

    const all = JSON.parse(raw);
    const current = all[selectedList];

    if (!current || !Array.isArray(current.transactions)) return;

    current.transactions.splice(index, 1);
    all[selectedList] = current;

    localStorage.setItem("demo_lists", JSON.stringify(all));
    setTransactions([...current.transactions]); // <- ważne!
  };

  if (!selectedList) {
    return (
      <section className="p-8">
        <p className="text-gray-600">
          Brak dostępnych list. Utwórz listę, aby rozpocząć.
        </p>
      </section>
    );
  }

  return (
    <section className="flex-1 p-8">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">List: {selectedList}</h2>
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
          key={view}
          transactions={transactions}
          onAddTransaction={addTransaction}
          onDeleteTransaction={deleteTransaction}
          onEditTransaction={editTransaction}
          list={selectedList}
        />
      )}

      {view === "expenses" && (
        <ExpensesPanel
          onChange={(month, year) => {
            setFilterMonth(month);
            setFilterYear(year);
          }}
          transactions={filteredTransactions}
        />
      )}

      {view === "options" && (
        <OptionsPanelDemo
          selectedList={selectedList}
          setAvailableLists={setAvailableLists}
          onSelectList={setSelectList}
          currency={currency}
          setCurrency={setCurrency}
        />
      )}
    </section>
  );
}
