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
      // Funkcja pomocnicza: zwraca datę w formacie "YYYY-MM-DD"
      const formatDate = (date: Date) => date.toDateString();

      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);

      const threeDaysAgo = new Date(now);
      threeDaysAgo.setDate(now.getDate() - 3);
      const demoData = {
        DemoList: {
          users: ["Alice", "Bob"],
          currency: "USD",
          transactions: [
            {
              title: "Lunch",
              addedBy: "Alice",
              forUser: "Bob",
              amount: 24.5,
              category: "food",
              date: formatDate(now), // dzisiaj
            },
            {
              title: "Groceries",
              addedBy: "Bob",
              forUser: "Alice",
              amount: 45.0,
              category: "home",
              date: formatDate(yesterday),
            },
            {
              title: "Taxi",
              addedBy: "Alice",
              forUser: "Alice",
              amount: 12.0,
              category: "subscription",
              date: formatDate(twoDaysAgo),
            },
            {
              title: "Movie tickets",
              addedBy: "Bob",
              forUser: "Bob",
              amount: 30.0,
              category: "other",
              date: formatDate(threeDaysAgo),
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
