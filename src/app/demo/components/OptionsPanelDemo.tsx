"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // upewnij się, że ścieżka się zgadza
import type { Transaction } from "./MainContentDemo"; // jeśli chcesz współdzielić typ

interface OptionsPanelProps {
  list: string;
  setAvailableLists: (lists: string[]) => void;
  onSelectList: (list: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

interface ListData {
  users: string[];
  transactions: Transaction;
}

const AVAILABLE_USERS = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona"];

export default function OptionsPanelDemo({
  selectedList,
  setAvailableLists,
  onSelectList,
  currency,
  setCurrency,
}: Omit<OptionsPanelProps, "list"> & { selectedList: string }) {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("demo_lists");
    if (!raw) return;

    try {
      const all: Record<string, ListData> = JSON.parse(raw);
      const listData = all[selectedList];
      if (listData && Array.isArray(listData.users)) {
        setUsers(listData.users);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to parse localStorage demo_list_data:", err);
      setUsers([]);
    }
  }, [selectedList]);

  useEffect(() => {
    const raw = localStorage.getItem("demo_lists") || "{}";
    const parsed = JSON.parse(raw);
    setAvailableLists(Object.keys(parsed));
  }, []);

  const addUser = () => {
    if (!selectedUser || users.includes(selectedUser)) return;

    const raw = localStorage.getItem("demo_lists") || "{}";

    let all: Record<string, ListData>;
    try {
      all = JSON.parse(raw);
    } catch {
      all = {};
    }

    const current = all[selectedList] || { users: [], transactions: [] };

    current.users.push(selectedUser);
    all[selectedList] = current;
    localStorage.setItem("demo_lists", JSON.stringify(all));
    setUsers(current.users);
    setSelectedUser("");
  };

  const removeUser = (u: string) => {
    const raw = localStorage.getItem("demo_lists") || "{}";
    const all = JSON.parse(raw);
    const current = all[selectedList];
    if (!current) return;

    current.users = current.users.filter((user: string) => user !== u);
    all[selectedList] = current;
    localStorage.setItem("demo_lists", JSON.stringify(all));
    setUsers(current.users);
  };

  const deleteList = () => {
    // 1. usuń nazwę z list
    const rawLists = localStorage.getItem("demo_lists") || "{}";
    const parsedLists = JSON.parse(rawLists);
    delete parsedLists[selectedList];
    localStorage.setItem("demo_lists", JSON.stringify(parsedLists));

    // 2. usuń dane z list_data
    const rawData = localStorage.getItem("demo_lists") || "{}";
    const parsedData = JSON.parse(rawData);
    delete parsedData[selectedList];
    localStorage.setItem("demo_lists", JSON.stringify(parsedData));

    // 3. przelicz listy i ustaw nową aktywną
    const updatedLists = Object.keys(parsedLists);
    setAvailableLists(updatedLists);
    onSelectList(updatedLists[0] || "");
  };

  return (
    <div className="space-y-6 max-w-xl p-6 flex border border-gray-300 rounded-lg bg-white shadow">
      <div className="flex-1/2 border border-gray-300 rounded-lg">
        <h3 className="text-2xl font-bold tracking-tight text-gray-800">
          Użytkownicy listy:{" "}
          <span className="text-blue-600">{selectedList}</span>
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
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz użytkownika" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_USERS.filter((u) => !users.includes(u)).map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={addUser} disabled={!selectedUser}>
            Dodaj
          </Button>
          <br />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">
          Currency: <span className="font-medium">PLN</span>
        </p>
      </div>
      <div className="justify-end">
        <Button onClick={deleteList}>Delete List</Button>
      </div>
      <div>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz użytkownika" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="PLN">PLN</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
