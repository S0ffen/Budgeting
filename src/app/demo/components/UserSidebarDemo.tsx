"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserSidebarDemo({
  selectedList,
  onSelectList,
}: {
  selectedList: string | null;
  onSelectList: (list: string) => void;
}) {
  const [lists, setLists] = useState<string[]>([]);
  const [newListName, setNewListName] = useState("");
  const [open, setOpen] = useState(false);
  const user = "sophia_0345";

  // Wczytaj listy przy starcie i każdej zmianie localStorage
  const loadLists = () => {
    const raw = localStorage.getItem("demo_lists");
    const parsed = raw ? JSON.parse(raw) : [];
    setLists(parsed);
  };

  useEffect(() => {
    loadLists();
  }, []);

  const addList = (name: string) => {
    if (!name.trim()) return;

    const existing: string[] = JSON.parse(
      localStorage.getItem("demo_lists") || "[]"
    );
    if (existing.includes(name)) return;

    const updated = [...existing, name];
    localStorage.setItem("demo_lists", JSON.stringify(updated));
    setLists(updated); // aktualizacja widoku
    onSelectList(name); // aktywuj nową listę
    setNewListName("");
    setOpen(false);
  };

  return (
    <aside className="w-72 p-6 bg-white border-r border-gray-200 flex flex-col justify-between">
      {/* top */}
      <div>
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-20 h-20 bg-gray-300 rounded-full" />
          <div className="text-lg font-semibold">Sophia Bennet</div>
          <div className="text-sm text-gray-500">@{user}</div>
        </div>

        <h3 className="font-bold mb-2 text-gray-700">Lists</h3>
        <div className="flex flex-col gap-2">
          {lists.map((list) => (
            <button
              key={list}
              onClick={() => onSelectList(list)}
              className={`w-full px-4 py-2 rounded-full font-medium transition ${
                selectedList === list
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {list}
            </button>
          ))}
        </div>
      </div>

      {/* bottom */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium py-2 mt-6 rounded-full w-full">
            Create new list
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new list</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="List name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <DialogFooter className="mt-4">
            <Button onClick={() => addList(newListName)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
