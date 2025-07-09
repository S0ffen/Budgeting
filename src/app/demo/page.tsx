"use client";
import { useState, useEffect } from "react";
import UserSidebarDemo from "./components/UserSidebarDemo";
import MainContentDemo from "./components/MainContentDemo";

export default function Demo() {
  const [selectedList, setSelectedList] = useState("DemoList");
  // wczytuje listy z localStorage i przechowuje je w stanie
  // dostępne listy będą używane do wyboru listy w bocznym pasku
  const [availableLists, setAvailableLists] = useState<string[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem("demo_lists") || "{}";
    const parsed = JSON.parse(raw);
    setAvailableLists(Object.keys(parsed));
  }, []);

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
  useEffect(() => {
    console.log("availableLists", availableLists);
    console.log("selectedList", selectedList);
  }, [availableLists, selectedList]);

  return (
    <main className="flex min-h-screen">
      <UserSidebarDemo
        availableLists={availableLists}
        setAvailableLists={setAvailableLists}
        selectedList={selectedList}
        onSelectList={setSelectedList}
      />
      <MainContentDemo
        selectedList={selectedList}
        setSelectList={setSelectedList}
        setAvailableLists={setAvailableLists}
      />
    </main>
  );
}
