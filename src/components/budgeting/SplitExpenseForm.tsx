import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, X, Users } from "lucide-react";
import { useFinanceStore } from "@/store/financeStore";

interface SplitItem {
  id: string;
  name: string;
  amount: number;
  assignedTo: string[];
}

const initialItems: SplitItem[] = [
  { id: "i1", name: "Butter Chicken", amount: 650, assignedTo: ["You"] },
  { id: "i2", name: "Dal Makhani", amount: 450, assignedTo: ["Rahul"] },
  { id: "i3", name: "Naan ×4", amount: 240, assignedTo: ["You", "Rahul", "Priya", "Karan"] },
  { id: "i4", name: "Paneer Tikka", amount: 550, assignedTo: ["Priya"] },
  { id: "i5", name: "Biryani", amount: 500, assignedTo: ["Karan"] },
  { id: "i6", name: "Drinks ×4", amount: 800, assignedTo: ["You", "Rahul", "Priya", "Karan"] },
  { id: "i7", name: "Dessert ×2", amount: 300, assignedTo: ["You", "Priya"] },
];

const initialPeople = ["You", "Rahul", "Priya", "Karan"];

export function SplitExpenseForm({ onClose }: { onClose: () => void }) {
  const accounts = useFinanceStore(s => s.accounts);
  const saveSplitExpense = useFinanceStore(s => s.saveSplitExpense);

  const [items, setItems] = useState<SplitItem[]>(initialItems);
  const [people] = useState<string[]>(initialPeople);
  const [sharedCost, setSharedCost] = useState(1310);
  const [payer, setPayer] = useState("You");
  const [payerAccountId, setPayerAccountId] = useState(accounts[0]?.id || "");
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [context, setContext] = useState("Dinner at Third Wave");

  const totalBill = items.reduce((s, i) => s + i.amount, 0) + sharedCost;
  const perPersonShared = sharedCost / people.length;

  const personTotals = people.map((person) => {
    const personalItems = items.filter((i) => i.assignedTo.includes(person));
    const itemTotal = personalItems.reduce((s, i) => s + i.amount / i.assignedTo.length, 0);
    return {
      name: person,
      itemTotal: Math.round(itemTotal * 100) / 100,
      sharedCost: Math.round(perPersonShared * 100) / 100,
      total: Math.round((itemTotal + perPersonShared) * 100) / 100,
    };
  });

  const addItem = () => {
    if (!newItemName || !newItemAmount) return;
    setItems([...items, { id: `i${Date.now()}`, name: newItemName, amount: parseFloat(newItemAmount), assignedTo: [...people] }]);
    setNewItemName("");
    setNewItemAmount("");
  };

  const togglePerson = (itemId: string, person: string) => {
    setItems(items.map((i) => {
      if (i.id !== itemId) return i;
      const assigned = i.assignedTo.includes(person) ? i.assignedTo.filter((p) => p !== person) : [...i.assignedTo, person];
      return { ...i, assignedTo: assigned.length ? assigned : [person] };
    }));
  };

  const removeItem = (itemId: string) => setItems(items.filter((i) => i.id !== itemId));

  const handleSave = () => {
    saveSplitExpense(totalBill, payerAccountId, personTotals, payer, context);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users size={18} /> Split Expense
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        {/* Context */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Context</p>
          <input value={context} onChange={(e) => setContext(e.target.value)}
            className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground outline-none placeholder:text-muted-foreground" />
        </div>

        {/* Bill items */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Items</p>
          {items.map((item) => (
            <div key={item.id} className="p-3 bg-muted/50 rounded-button space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">₹{item.amount}</span>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive"><X size={12} /></button>
                </div>
              </div>
              <div className="flex gap-1.5">
                {people.map((person) => (
                  <button key={person} onClick={() => togglePerson(item.id, person)}
                    className={`px-2 py-1 text-[10px] rounded transition-colors ${
                      item.assignedTo.includes(person) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>{person}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <input placeholder="Item name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 h-8 px-3 text-sm bg-muted rounded-button text-foreground placeholder:text-muted-foreground outline-none" />
            <input placeholder="₹ Amount" type="number" value={newItemAmount} onChange={(e) => setNewItemAmount(e.target.value)}
              className="w-24 h-8 px-3 text-sm bg-muted rounded-button text-foreground placeholder:text-muted-foreground outline-none font-mono" />
            <button onClick={addItem} className="h-8 px-3 rounded-button bg-primary text-primary-foreground text-xs"><Plus size={14} /></button>
          </div>
        </div>

        {/* Shared costs */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Shared Costs (Tax + Tip)</p>
          <input type="number" value={sharedCost} onChange={(e) => setSharedCost(parseFloat(e.target.value) || 0)}
            className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground font-mono outline-none" />
          <p className="text-[10px] text-muted-foreground">Split equally: ₹{perPersonShared.toFixed(2)} per person</p>
        </div>

        {/* Payer + Account */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Who Paid?</p>
            <div className="flex flex-wrap gap-2">
              {people.map((person) => (
                <button key={person} onClick={() => setPayer(person)}
                  className={`px-3 py-1.5 text-xs rounded-button transition-colors ${
                    payer === person ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                  }`}>{person}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">From Account</p>
            <select value={payerAccountId} onChange={(e) => setPayerAccountId(e.target.value)}
              className="w-full h-9 px-3 bg-muted rounded-button text-foreground text-sm outline-none">
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Bill</span>
            <span className="font-mono font-semibold text-foreground">₹{totalBill.toLocaleString("en-IN")}</span>
          </div>
          {personTotals.map((p) => (
            <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  Items: ₹{p.itemTotal.toFixed(2)} + Shared: ₹{p.sharedCost.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-foreground">₹{p.total.toFixed(2)}</p>
                {p.name !== payer && (
                  <p className="text-[10px] text-warning">owes {payer} ₹{p.total.toFixed(2)}</p>
                )}
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground">
            💡 Receivables will be added to your Net Worth as IOU assets until settled.
          </p>
        </div>

        <button onClick={handleSave}
          className="w-full h-10 rounded-button bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Save Split & Record Expense
        </button>
      </div>
    </motion.div>
  );
}
