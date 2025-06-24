"use client";
import { useState, useEffect } from "react";
import UserSidebarDemo from "./components/UserSidebarDemo";
import MainContentDemo from "./components/MainContentDemo";

export default function Demo() {
  const [selectedList, setSelectedList] = useState("Friends");
  // Inicjalizacja danych demo
  useEffect(() => {
    const raw = localStorage.getItem("demo_lists");
    if (!raw) {
      const demoData = {
        DemoList: {
          users: ["Alice", "Bob"],
          transactions: [
            {
              title: "Lunch",
              addedBy: "Alice",
              forUser: "Bob",
              amount: 24.5,
              type: "REQUIREMENT",
              date: "2025-06-01",
            },
            {
              title: "Groceries",
              addedBy: "Bob",
              forUser: "Alice",
              amount: 45.0,
              type: "REPAYMENT",
              date: "2025-06-02",
            },
            {
              title: "Taxi",
              addedBy: "Alice",
              forUser: "Alice",
              amount: 12.0,
              type: "REQUIREMENT",
              date: "2025-06-03",
            },
            {
              title: "Movie tickets",
              addedBy: "Bob",
              forUser: "Bob",
              amount: 30.0,
              type: "REQUIREMENT",
              date: "2025-06-04",
            },
          ],
        },
      };
      localStorage.setItem("demo_lists", JSON.stringify(demoData));
    }
  }, []);

  return (
    <main className="flex min-h-screen">
      <UserSidebarDemo
        selectedList={selectedList}
        onSelectList={setSelectedList}
      />
      <MainContentDemo list={selectedList} />
    </main>
  );
}
