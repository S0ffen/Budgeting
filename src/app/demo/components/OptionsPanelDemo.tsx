"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface OptionsPanelProps {
  list: string;
}

interface ListData {
  users: string[];
  transactions: any[];
}

// Stała lista dostępnych użytkowników (demo)
const AVAILABLE_USERS = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona"];

export default function OptionsPanelDemo({ list }: OptionsPanelProps) {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("demo_list_data");
    if (!raw) return;

    try {
      const all: Record<string, ListData> = JSON.parse(raw);
      const listData = all[list];
      if (listData && Array.isArray(listData.users)) {
        setUsers(listData.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to parse localStorage demo_list_data:", err);
      setUsers([]);
    }
  }, [list]);

  const addUser = () => {
    if (!selectedUser || users.includes(selectedUser)) return;

    const raw = localStorage.getItem("demo_list_data") || "{}";

    let all: Record<string, ListData>;
    try {
      all = JSON.parse(raw);
    } catch {
      all = {};
    }

    const current = all[list] || { users: [], transactions: [] };

    current.users.push(selectedUser);
    all[list] = current;
    localStorage.setItem("demo_list_data", JSON.stringify(all));
    setUsers(current.users);
    setSelectedUser("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        Users in list: <span className="text-gray-800">{list}</span>
      </h3>

      {users.length > 0 ? (
        <ul className="list-disc list-inside text-gray-700">
          {users.map((u) => (
            <li key={u} className="flex justify-between items-center">
              <span>{u}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const raw = localStorage.getItem("demo_list_data") || "{}";
                  const all = JSON.parse(raw);
                  const current = all[list];
                  if (!current) return;

                  current.users = current.users.filter(
                    (user: string) => user !== u
                  );
                  all[list] = current;
                  localStorage.setItem("demo_list_data", JSON.stringify(all));
                  setUsers(current.users);
                }}
              >
                Usuń
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No users yet.</p>
      )}

      <div className="flex gap-2 items-center">
        <select
          className="border px-3 py-2 rounded"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select user --</option>
          {AVAILABLE_USERS.filter((u) => !users.includes(u)).map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <Button onClick={addUser} disabled={!selectedUser}>
          Add
        </Button>
      </div>
    </div>
  );
}
