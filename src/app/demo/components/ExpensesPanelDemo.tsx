import React, { useState, useEffect } from "react";

const months = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

const years = [2023, 2024, 2025];

type Transaction = {
  title: string;
  addedBy: string;
  forUser: string;
  amount: number;
  category: string;
  date: string;
};

type Props = {
  onChange: (month: number, year: number) => void;
  transactions: Transaction[];
};

const ExpensesPanel: React.FC<Props> = ({ onChange, transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    onChange(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, onChange]);

  const handleChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      txDate.getMonth() === selectedMonth &&
      txDate.getFullYear() === selectedYear
    );
  });

  const totalAmount = filteredTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  return (
    <div>
      <div className="flex gap-4 items-center mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => handleChange(Number(e.target.value), selectedYear)}
          className="p-2 border rounded"
        >
          {months.map((name, index) => (
            <option key={index} value={index}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => handleChange(selectedMonth, Number(e.target.value))}
          className="p-2 border rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <h3 className="text-xl font-semibold mb-4">Podsumowanie wydatków</h3>
      <p>Łączna kwota: {totalAmount} PLN</p>

      <ul className="mt-4 space-y-2">
        {transactions.length === 0 && <li>Brak transakcji w tym okresie.</li>}
        {transactions.map((tx, idx) => (
          <li key={idx} className="p-3 border rounded shadow-sm bg-white">
            <div className="font-semibold">{tx.title}</div>
            <div className="text-sm text-gray-600">
              <span className="mr-2">📅 {tx.date}</span>
              <span className="mr-2">👤 Dodane przez: {tx.addedBy}</span>
              <span className="mr-2">➡️ Dla: {tx.forUser}</span>
              <span className="mr-2">💸 {tx.amount} PLN</span>
              <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 border">
                {tx.category}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesPanel;
