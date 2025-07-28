"use client";
import { useState } from "react";

import SupportForm from "@/app/demo/components/SupportFormDemo";

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
  availableLists,
  setAvailableLists,
  selectedList,
  onSelectList,
}: {
  availableLists: string[];
  setAvailableLists: (lists: string[]) => void;
  selectedList: string | null;
  onSelectList: (list: string) => void;
}) {
  const [newListName, setNewListName] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const user = "Sophia";

  const addList = (name: string) => {
    if (!name.trim()) return;

    const existing = JSON.parse(localStorage.getItem("demo_lists") || "{}");

    // upewnij się że to obiekt
    if (typeof existing !== "object" || Array.isArray(existing)) return;

    if (Object.keys(existing).includes(name)) return;

    const updated = {
      ...existing,
      [name]: {
        users: [],
        transactions: [],
      },
    };

    localStorage.setItem("demo_lists", JSON.stringify(updated));
    setAvailableLists(Object.keys(updated));
    onSelectList(name);
    setNewListName("");
    setOpenCreate(false);
  };

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  return (
    <aside className="w-72 p-6 bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center gap-2 mb-8">
          <div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setAvatarPreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <label htmlFor="avatar-upload">
              <div
                className="w-20 h-20 rounded-full bg-gray-200 cursor-pointer bg-cover bg-center"
                style={{
                  backgroundImage: avatarPreview
                    ? `url(${avatarPreview})`
                    : "none",
                }}
              >
                {!avatarPreview && (
                  <div className="flex items-center justify-center w-full h-full text-xs text-gray-500">
                    Add avatar
                  </div>
                )}
              </div>
            </label>
          </div>
          <div className="text-lg font-semibold">Sophia Bennet</div>
          <div className="text-sm text-gray-500">@{user}</div>
        </div>

        <h3 className="text-xl font-bold mb-3 text-gray-800 tracking-wide">
          Lists
        </h3>
        <div className="flex flex-col gap-2 mb-4">
          {availableLists.map((list) => (
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
      </div>
    </aside>
  );
}
