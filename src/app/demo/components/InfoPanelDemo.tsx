import { FC, useEffect, useState } from "react";
import { Trash2, Pencil, CalendarIcon } from "lucide-react";

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
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Transaction {
  title: string;
  addedBy: string;
  forUser: string;
  amount: number;
  category: string;
  date: string;
}

interface InfoPanelProps {
  transactions: Transaction[];
  onAddTransaction: (
    title: string,
    amount: number,
    forUser: string,
    addedBy: string,
    category: string,
    date: string
  ) => void;
  onDeleteTransaction: (index: number) => void;
  onEditTransaction: (index: number, updated: Partial<Transaction>) => void;
  list: string;
}

const InfoPanel: FC<InfoPanelProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction,
  list,
}) => {
  const currentUser = "Sophia";
  //Dialogi
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState("");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [isUserOwesMe, setIsUserOwesMe] = useState(true);
  const [users, setUsers] = useState<string[]>([]);
  const [involvesOtherUser, setInvolvesOtherUser] = useState(false);
  const [newCategory, setNewCategory] = useState("food"); // domyślna wartość

  const [date, setDate] = useState<Date>();

  useEffect(() => {
    const raw = localStorage.getItem("demo_lists");
    if (!raw) return;

    try {
      const all = JSON.parse(raw);
      const listData = all[list];
      if (listData && Array.isArray(listData.users)) {
        console.log("Loaded Data into InfoPanel:", listData);
        setUsers(listData.users);
        setSelectedUser((prev) =>
          listData.users.includes(prev) ? prev : listData.users[0] || ""
        );
        setCurrentCurrency(listData.currency); // domyślna waluta
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

    onAddTransaction(
      newTitle,
      parseFloat(newAmount),
      forUser,
      addedBy,
      newCategory,
      date?.toDateString() || new Date().toDateString()
    );

    setNewTitle("");
    setNewAmount("");
    setSelectedUser(users[0] || "");
    setInvolvesOtherUser(false);
    setIsUserOwesMe(true);
    setShowAdd(false);
  };
  const handleEdit = () => {
    //fallback
    if (!newTitle.trim() || !newAmount.trim() || selectedIndex === null) return;
    const selectedTransaction = transactions[selectedIndex];
    console.log("Selected Transaction:", selectedTransaction);
    const UpdatingTransaction: Transaction = {
      ...selectedTransaction,
      title: newTitle,
      amount: parseFloat(newAmount),
      forUser: selectedTransaction.forUser,
      addedBy: selectedTransaction.addedBy,
      category: newCategory,
    };
    console.log("Updating Transaction:", UpdatingTransaction);
    onEditTransaction(selectedIndex, {
      title: newTitle,
      amount: parseFloat(newAmount),
      category: newCategory,
    });
    setShowEdit(false);
  };

  return (
    <div className="space-y-4 mb-8">
      {transactions.map((tx, i) => (
        <motion.div
          // TODO: poprawić to bo jak damy te sama date i tytuł to będzie błąd
          key={tx.title + tx.date} // ważne: unikalny klucz, nie sam `i`
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
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
          <div className="flex items-center gap-4">
            {/* Typ + kwota */}
            <div className="text-right">
              <div className="uppercase text-sm text-gray-500">
                {tx.category}
              </div>
              <div className="text-lg font-bold">
                {tx.amount.toFixed(2)} {currentCurrency}
              </div>
            </div>

            {/* Kosz jako osobny blok */}
            <button
              className="p-2 hover:text-red-500 hover:bg-red-100 rounded"
              onClick={() => onDeleteTransaction(i)}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            {/* Edycja jako osobny blok */}
            <button
              className="p-2 hover:text-yellow-500 hover:bg-red-100 rounded"
              onClick={() => {
                setSelectedIndex(i); // <- `i` to index z `.map`
                setNewTitle(tx.title); // <- wczytaj dane transakcji
                setNewAmount(tx.amount.toString());
                setShowEdit(true);
              }}
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      ))}
      {/* Dialog Edycji Elementu */}
      {selectedIndex !== null && (
        <Dialog open={showEdit} onOpenChange={setShowEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
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
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">🍕 Food</SelectItem>
                <SelectItem value="house">🏠 House</SelectItem>
                <SelectItem value="subscription">📺 Subscription</SelectItem>
                <SelectItem value="other">🛒 Other</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleEdit}
              disabled={!newTitle.trim() || !newAmount.trim()}
            >
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      )}
      {/* Dialog Dodawania Elementu */}
      <div className="flex justify-between gap-4">
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <button className="flex-1 bg-teal-200 hover:bg-teal-300 py-3 rounded font-semibold">
              Add
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                Fill in the title and amount
              </DialogDescription>
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

            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">🍕 Food</SelectItem>
                <SelectItem value="house">🏠 House</SelectItem>
                <SelectItem value="subscription">📺 Subscription</SelectItem>
                <SelectItem value="other">🛒 Other</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!date}
                  className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>

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
                <div className="w-full flex items-center justify-center">
                  <button
                    className="z-10 text-sm underline"
                    onClick={() => setIsUserOwesMe((prev) => !prev)}
                  >
                    Swap
                  </button>
                </div>
                <div className="flex items-center justify-center gap-12 mb-4 h-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isUserOwesMe ? "pink-left" : "pink-right"}
                      initial={{ x: isUserOwesMe ? -80 : 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: isUserOwesMe ? 80 : -40, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute ${
                        isUserOwesMe ? "left-80" : "right-80"
                      } `}
                    >
                      <span>{currentUser}</span>
                    </motion.div>
                  </AnimatePresence>
                  <div>
                    <span className="relative text-3xl">→</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={!isUserOwesMe ? "blue-left" : "blue-right"}
                      initial={{ x: !isUserOwesMe ? -80 : 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: !isUserOwesMe ? 80 : -40, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute ${
                        !isUserOwesMe ? "left-80" : "right-80"
                      } `}
                    >
                      <span>{selectedUser}</span>
                    </motion.div>
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
