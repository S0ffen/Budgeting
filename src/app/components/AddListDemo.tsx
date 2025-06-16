"use client";

import { useState } from "react";

export default function AddListDemo() {
  const [listName, setListName] = useState("");

  const handleAdd = () => {
    if (!listName.trim()) return;

    const existing = JSON.parse(localStorage.getItem("demo_lists") || "[]");
    const updated = [...existing, listName];
    localStorage.setItem("demo_lists", JSON.stringify(updated));
    window.location.reload(); // albo setLists przez lifting state
  };

  return (
    <div className="mt-6">
      <input
        className="border p-2 mr-2"
        type="text"
        placeholder="Nazwa listy"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
        onClick={handleAdd}
      >
        Dodaj listę
      </button>
    </div>
  );
}
