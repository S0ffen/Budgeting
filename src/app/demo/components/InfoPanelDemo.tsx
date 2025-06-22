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
  amount: number;
  type: "REQUIREMENT" | "REPAYMENT";
  date: string;
}

interface InfoPanelProps {
  transactions: Transaction[];
  onAddTransaction: (title: string, amount: number, addedBy: string) => void;
  onEdit: () => void;
  list: string;
}

const InfoPanel: FC<InfoPanelProps> = ({
  transactions,
  onAddTransaction,
  onEdit,
  list,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("demo_list_data");
    if (!raw) return;

    try {
      const all = JSON.parse(raw);
      const listData = all[list];
      if (listData && Array.isArray(listData.users)) {
        setUsers(listData.users);
        setAddedBy((prev) =>
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
    if (!newTitle.trim() || !newAmount.trim() || !addedBy.trim()) return;
    onAddTransaction(newTitle, parseFloat(newAmount), addedBy);
    setNewTitle("");
    setNewAmount("");
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
                {tx.date} • Added by {tx.addedBy}
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
            <select
              value={addedBy}
              onChange={(e) => setAddedBy(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              {users.length > 0 ? (
                users.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))
              ) : (
                <option value="">No users available</option>
              )}
            </select>
            <Button
              onClick={handleAdd}
              disabled={!addedBy || users.length === 0}
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
