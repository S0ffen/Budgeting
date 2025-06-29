"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface OptionsPanelProps {
  list: string;
}

interface ListData {
  users: string[];
  transactions: any[];
}

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

  const removeUser = (u: string) => {
    const raw = localStorage.getItem("demo_list_data") || "{}";
    const all = JSON.parse(raw);
    const current = all[list];
    if (!current) return;

    current.users = current.users.filter((user: string) => user !== u);
    all[list] = current;
    localStorage.setItem("demo_list_data", JSON.stringify(all));
    setUsers(current.users);
  };

  const deleteList = () => {
    const raw = localStorage.getItem("demo_list_data") || "{}";
    const all: Record<string, ListData> = JSON.parse(raw);

    if (all[list]) {
      delete all[list];
      localStorage.setItem("demo_list_data", JSON.stringify(all));
      setUsers([]);
      setSelectedUser("");
    }
  };

  return (
    <div className="space-y-6 max-w-xl p-6 flex">
      <div className="border border-gray-300 rounded-lg bg-white shadow p-4 flex-1/2">
        <h3 className="text-2xl font-bold tracking-tight text-gray-800">
          Użytkownicy listy: <span className="text-blue-600">{list}</span>
        </h3>
        {users.length > 0 ? (
          <ul className="space-y-2">
            <AnimatePresence>
              {users.map((u) => (
                <motion.li
                  key={u}
                  className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md border"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <span className="font-medium text-gray-700">{u}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeUser(u)}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Usuń
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="text-gray-500 italic">Brak użytkowników.</p>
        )}

        <div className="flex items-center gap-3">
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Wybierz użytkownika --</option>
            {AVAILABLE_USERS.filter((u) => !users.includes(u)).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <Button onClick={addUser} disabled={!selectedUser}>
            Dodaj
          </Button>
        </div>
      </div>

      <div className="flex-1/2 items-center gap-3 border border-gray-300 rounded-lg p-4 bg-white shadow">
        <Button onClick={deleteList}>Delete List</Button>
      </div>
    </div>
  );
}
