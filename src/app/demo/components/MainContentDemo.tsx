// src/app/components/MainContentDemo.tsx
"use client";
import { useEffect, useState } from "react";
import OptionsPanelDemo from "./OptionsPanelDemo";
import InfoPanel from "./InfoPanelDemo";
import ExpensesPanel from "./ExpensesPanelDemo";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // upewnij się, że ścieżka się zgadza

export interface Transaction {
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
    category: string,
    date: string
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
      date,
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
  //TODO zrozumieć ten kod
  const views = ["info", "expenses", "options"] as const;

  return (
    <section className="flex-1 p-8">
      <header className="flex flex-col gap-y-2 mb-6">
        <h2 className="text-2xl font-bold">List: {selectedList}</h2>
        <div className="flex-col">
          <div className="flex">
            <span className="text-xl font-bold mr-2">Year: </span>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex">
            <span className="text-xl font-bold mr-2">Month: </span>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Select a Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">January</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <div className="flex border-b border-gray-300 mb-4">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
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

      {view === "expenses" && <ExpensesPanel />}

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
