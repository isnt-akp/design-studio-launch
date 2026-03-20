import { motion } from "framer-motion";
import { useState } from "react";
import { X, Receipt, ArrowUpRight, ArrowDownLeft, RotateCcw, CreditCard } from "lucide-react";
import { useFinanceStore } from "@/store/financeStore";

const categories = ["Transport", "Food", "Grocery", "Shopping", "Bills", "Salary", "Freelance", "Rental", "Health", "Entertainment", "Transfer", "Other"];
const paymentMethods = ["UPI", "Credit Card", "Debit Card", "Cash", "Netbanking", "Auto-debit"];
const transactionTypes = ["Expense", "Income", "Transfer", "Refund"] as const;

export function TransactionForm({ onClose }: { onClose: () => void }) {
  const accounts = useFinanceStore(s => s.accounts);
  const goals = useFinanceStore(s => s.goals);
  const addTransaction = useFinanceStore(s => s.addTransaction);

  const [type, setType] = useState<string>("Expense");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [toAccountId, setToAccountId] = useState("");
  const [goalId, setGoalId] = useState("");
  const [note, setNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isReimbursable, setIsReimbursable] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [forexRate, setForexRate] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSave = () => {
    if (!amount || !category || !accountId) return;
    const amountNum = parseFloat(amount);
    const finalAmount = currency !== "INR" && forexRate ? amountNum * parseFloat(forexRate) : amountNum;

    addTransaction({
      type: type.toLowerCase() as "income" | "expense" | "transfer" | "refund",
      category,
      subCategory,
      amount: finalAmount,
      originalAmount: currency !== "INR" ? amountNum : undefined,
      originalCurrency: currency !== "INR" ? currency : undefined,
      forexRate: currency !== "INR" && forexRate ? parseFloat(forexRate) : undefined,
      method: paymentMethod,
      accountId,
      toAccountId: type === "Transfer" ? toAccountId : undefined,
      goalId: goalId || undefined,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      tags,
      isReimbursable,
      isRecurring,
      note,
    });
    onClose();
  };

  const typeIcon = () => {
    switch (type) {
      case "Income": return <ArrowDownLeft size={14} className="text-success" />;
      case "Expense": return <ArrowUpRight size={14} className="text-destructive" />;
      case "Refund": return <RotateCcw size={14} className="text-info" />;
      default: return <CreditCard size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card rounded-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Receipt size={18} /> New Transaction
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        {/* Type selector */}
        <div className="flex gap-1.5">
          {transactionTypes.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 px-2 py-2 text-xs rounded-button transition-colors flex items-center justify-center gap-1 ${
                type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{t}</button>
          ))}
        </div>

        {/* Account selector */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Account</label>
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)}
            className="w-full h-9 px-3 bg-muted rounded-button text-foreground text-sm outline-none">
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.institution})</option>
            ))}
          </select>
        </div>

        {/* Transfer: To Account */}
        {type === "Transfer" && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">To Account</label>
            <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)}
              className="w-full h-9 px-3 bg-muted rounded-button text-foreground text-sm outline-none">
              <option value="">Select...</option>
              {accounts.filter(a => a.id !== accountId).map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Amount */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Amount</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
                {currency === "INR" ? "₹" : "$"}
              </span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="0" className="w-full h-10 pl-7 pr-3 text-lg bg-muted rounded-button text-foreground font-mono outline-none" />
            </div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="h-10 px-2 bg-muted rounded-button text-foreground text-xs outline-none">
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          {currency !== "INR" && (
            <div className="flex gap-2">
              <input type="number" value={forexRate} onChange={(e) => setForexRate(e.target.value)}
                placeholder="Forex rate (₹ per unit)" className="flex-1 h-8 px-3 text-sm bg-muted rounded-button text-foreground font-mono outline-none placeholder:text-muted-foreground" />
              {forexRate && amount && (
                <span className="text-xs text-muted-foreground self-center font-mono">
                  = ₹{(parseFloat(amount) * parseFloat(forexRate)).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Category</label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-2.5 py-1.5 text-[11px] rounded-button transition-colors ${
                  category === c ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                }`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Sub-category */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Sub-category / Merchant</label>
          <input value={subCategory} onChange={(e) => setSubCategory(e.target.value)}
            placeholder="e.g., Uber, Swiggy, Netflix" className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground outline-none placeholder:text-muted-foreground" />
        </div>

        {/* Link to Goal (Layer 3↔9 wiring) */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Link to Goal (Optional)</label>
          <select value={goalId} onChange={(e) => setGoalId(e.target.value)}
            className="w-full h-9 px-3 bg-muted rounded-button text-foreground text-sm outline-none">
            <option value="">None</option>
            {goals.map(g => (
              <option key={g.id} value={g.id}>{g.icon} {g.name}</option>
            ))}
          </select>
        </div>

        {/* Payment method */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Payment Method</label>
          <div className="flex flex-wrap gap-1.5">
            {paymentMethods.map((m) => (
              <button key={m} onClick={() => setPaymentMethod(m)}
                className={`px-2.5 py-1.5 text-[11px] rounded-button transition-colors ${
                  paymentMethod === m ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                }`}>{m}</button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tags</label>
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-1 rounded bg-primary/20 text-primary-light flex items-center gap-1">
                {tag} <button onClick={() => setTags(tags.filter(t => t !== tag))}><X size={8} /></button>
              </span>
            ))}
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              placeholder="Add tag" className="h-6 px-2 text-[10px] bg-muted rounded text-foreground outline-none placeholder:text-muted-foreground w-20" />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={isReimbursable} onChange={(e) => setIsReimbursable(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-primary" />
            Reimbursable
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-primary" />
            Recurring
          </label>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Note</label>
          <input value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note..." className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground outline-none placeholder:text-muted-foreground" />
        </div>

        <button onClick={handleSave}
          className="w-full h-10 rounded-button bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          {typeIcon()} Save {type}
        </button>
      </div>
    </motion.div>
  );
}
