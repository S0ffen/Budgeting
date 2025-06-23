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
import { motion, AnimatePresence } from "motion/react";

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
  const [involvesOtherUser, setInvolvesOtherUser] = useState(false);

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

    let forUser = currentUser;
    let addedBy = currentUser;

    if (involvesOtherUser && selectedUser.trim()) {
      forUser = isUserOwesMe ? selectedUser : currentUser;
      addedBy = isUserOwesMe ? currentUser : selectedUser;
    }

    onAddTransaction(newTitle, parseFloat(newAmount), forUser, addedBy);

    setNewTitle("");
    setNewAmount("");
    setSelectedUser(users[0] || "");
    setInvolvesOtherUser(false);
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
                {tx.date} • {tx.addedBy}
                {tx.addedBy !== tx.forUser && ` → ${tx.forUser}`}
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
                checked={involvesOtherUser}
                onChange={(e) => setInvolvesOtherUser(e.target.checked)}
                disabled={users.length === 0}
              />
              This involves another user
            </label>

            {involvesOtherUser && (
              <>
                <div className="relative flex items-center justify-center gap-24 mb-4 h-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isUserOwesMe ? "pink-left" : "pink-right"}
                      initial={{ x: isUserOwesMe ? -80 : 80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: isUserOwesMe ? 80 : -80, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute ${
                        isUserOwesMe ? "left-0" : "right-0"
                      } w-10 h-10 bg-pink-300 rounded-full`}
                    />
                  </AnimatePresence>
                  <button
                    className="z-10 text-sm underline"
                    onClick={() => setIsUserOwesMe((prev) => !prev)}
                  >
                    Swap
                  </button>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={!isUserOwesMe ? "blue-left" : "blue-right"}
                      initial={{ x: !isUserOwesMe ? -80 : 80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: !isUserOwesMe ? 80 : -80, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute ${
                        !isUserOwesMe ? "left-0" : "right-0"
                      } w-10 h-10 bg-blue-300 rounded-full`}
                    />
                  </AnimatePresence>
                </div>

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
              </>
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
