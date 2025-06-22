import { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Transaction {
  title: string;
  addedBy: string;
  forUser: string;
  amount: number;
  type: "REQUIREMENT" | "REPAYMENT";
  date: string;
}

interface InfoPanelProps {
  transactions: Transaction[];
  onAddTransaction: (
    title: string,
    amount: number,
    forUser: string,
    addedBy: string
  ) => void;
  onEdit: () => void;
  list: string;
}

const InfoPanel: FC<InfoPanelProps> = ({
  transactions,
  onAddTransaction,
  onEdit,
  list,
}) => {
  const currentUser = "Sophia";
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isUserOwesMe, setIsUserOwesMe] = useState(true);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("demo_list_data");
    if (!raw) return;

    try {
      const all = JSON.parse(raw);
      const listData = all[list];
      if (listData && Array.isArray(listData.users)) {
        setUsers(listData.users);
        setSelectedUser((prev) =>
          listData.users.includes(prev) ? prev : listData.users[0] || ""
        );
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to load users from localStorage:", err);
      setUsers([]);
    }
  }, [list]);

  const handleAdd = () => {
    if (!newTitle.trim() || !newAmount.trim()) return;

    const targetUser = selectedUser || currentUser;
    const forUser = isUserOwesMe ? targetUser : currentUser;
    const addedBy = isUserOwesMe ? currentUser : targetUser;

    onAddTransaction(newTitle, parseFloat(newAmount), forUser, addedBy);

    setNewTitle("");
    setNewAmount("");
    setSelectedUser(users[0] || "");
    setIsUserOwesMe(true);
    setShowAdd(false);
  };

  return (
    <div className="space-y-4 mb-8">
      {transactions.map((tx, i) => (
        <div
          key={i}
          className="flex justify-between items-center bg-white p-4 rounded shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div>
              <div className="font-semibold">{tx.title}</div>
              <div className="text-sm text-gray-500">
                {tx.date} • {tx.addedBy} → {tx.forUser}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="uppercase text-sm text-gray-500">{tx.type}</div>
            <div className="text-lg font-bold">${tx.amount.toFixed(2)}</div>
          </div>
        </div>
      ))}

      <div className="flex justify-between gap-4">
        <button
          className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded font-semibold"
          onClick={onEdit}
        >
          Edit items
        </button>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <button className="flex-1 bg-teal-200 hover:bg-teal-300 py-3 rounded font-semibold">
              Add item
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new item</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-2"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="mb-2"
            />

            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={isUserOwesMe}
                onChange={(e) => setIsUserOwesMe(e.target.checked)}
                disabled={users.length === 0}
              />
              {isUserOwesMe ? "Selected user owes me" : "I owe selected user"}
            </label>

            {users.length > 0 ? (
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
              >
                {users.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                placeholder="(optional) User name"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="mb-4"
              />
            )}

            <Button
              onClick={handleAdd}
              disabled={!newTitle.trim() || !newAmount.trim()}
            >
              Add
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InfoPanel;
