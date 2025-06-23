"use client";
import { useEffect, useState } from "react";
import SupportForm from "@/app/demo/SupportForm";
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
  const [openCreate, setOpenCreate] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const user = "sophia_0345";

  useEffect(() => {
    const raw = localStorage.getItem("demo_lists");
    const parsed = raw ? JSON.parse(raw) : [];
    setLists(parsed);
  }, []);

  const addList = (name: string) => {
    if (!name.trim()) return;

    const existing: string[] = JSON.parse(localStorage.getItem("demo_lists") || "[]");
    if (existing.includes(name)) return;

    const updated = [...existing, name];
    localStorage.setItem("demo_lists", JSON.stringify(updated));
    setLists(updated);
    onSelectList(name);
    setNewListName("");
    setOpenCreate(false);
  };

  const logout = () => {
    console.log("Użytkownik wylogowany");
    setOpenLogout(false);
  };

  return (
    <aside className="w-72 p-6 bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-20 h-20 bg-gray-300 rounded-full" />
          <div className="text-lg font-semibold">Sophia Bennet</div>
          <div className="text-sm text-gray-500">@{user}</div>
        </div>

        <h3 className="text-xl font-bold mb-3 text-gray-800 tracking-wide">Lists</h3>
        <div className="flex flex-col gap-2 mb-4">
          {lists.map((list) => (
            <button
              key={list}
              onClick={() => onSelectList(list)}
              className={`w-full px-4 py-2 rounded-full font-medium ${
                selectedList === list
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {list}
            </button>
          ))}
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <button className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-2 rounded-full">
              Create new list
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <DialogFooter className="flex flex-col gap-2">
              <Button onClick={() => addList(newListName)} className="w-full">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-medium py-2 rounded-full w-full">
              Support
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
            </DialogHeader>
            <SupportForm />
          </DialogContent>
        </Dialog>

        <Dialog open={openLogout} onOpenChange={setOpenLogout}>
          <DialogTrigger asChild>
            <button className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 rounded-full w-full">
              Logout
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to log out?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2">
              <Button variant="ghost" onClick={() => setOpenLogout(false)} className="w-full">
                Cancel
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 w-full" onClick={logout}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}
