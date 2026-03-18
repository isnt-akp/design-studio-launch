import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Filter, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, RotateCcw, MoreVertical, Camera, IndianRupee, Receipt } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const transactions = [
  { id: 1, type: "expense", category: "Transport", sub: "Uber", amount: 250, method: "UPI", date: "Mar 17", tags: ["commute"] },
  { id: 2, type: "expense", category: "Grocery", sub: "D-Mart", amount: 2340, method: "Credit Card", date: "Mar 16", tags: ["essentials"] },
  { id: 3, type: "income", category: "Salary", sub: "March 2026", amount: 150000, method: "Bank Transfer", date: "Mar 1", tags: ["primary"] },
  { id: 4, type: "expense", category: "Food", sub: "Swiggy", amount: 680, method: "UPI", date: "Mar 15", tags: ["food"] },
  { id: 5, type: "expense", category: "Bills", sub: "Netflix", amount: 649, method: "Auto-debit", date: "Mar 5", tags: ["recurring"] },
  { id: 6, type: "refund", category: "Shopping", sub: "Amazon Return", amount: 2500, method: "Credit Card", date: "Mar 12", tags: [] },
  { id: 7, type: "expense", category: "Transport", sub: "Auto/Rickshaw", amount: 80, method: "Cash", date: "Mar 17", tags: ["commute", "cash"] },
  { id: 8, type: "income", category: "Rental", sub: "2BHK Whitefield", amount: 28000, method: "Bank Transfer", date: "Mar 5", tags: ["passive"] },
];

const budgetEnvelopes = [
  { category: "Food & Dining", cap: 8000, spent: 5200, icon: "🍕" },
  { category: "Transport", cap: 4000, spent: 3800, icon: "🚗" },
  { category: "Shopping", cap: 5000, spent: 1200, icon: "🛍️" },
  { category: "Entertainment", cap: 3000, spent: 3100, icon: "🎬" },
  { category: "Bills & Utilities", cap: 6000, spent: 4200, icon: "📱" },
  { category: "Grocery", cap: 6000, spent: 2340, icon: "🛒" },
];

const splits = [
  { person: "Rahul", amount: 1037.50, status: "Pending", context: "Dinner at Third Wave" },
  { person: "Priya", amount: 1287.50, status: "Pending", context: "Dinner at Third Wave" },
  { person: "Karan", amount: 1087.50, status: "Partial", context: "Dinner at Third Wave" },
];

const typeIcon = (type: string) => {
  switch (type) {
    case "income": return <ArrowDownLeft size={14} className="text-success" />;
    case "expense": return <ArrowUpRight size={14} className="text-destructive" />;
    case "refund": return <RotateCcw size={14} className="text-info" />;
    default: return <ArrowLeftRight size={14} className="text-muted-foreground" />;
  }
};

const Budgeting = () => {
  const [activeTab, setActiveTab] = useState<"transactions" | "budgets" | "splits">("transactions");

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Budgeting & Cash Flow</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Summary Strip */}
      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Income</p>
          <p className="font-mono text-lg font-semibold text-success">₹{totalIncome.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Expenses</p>
          <p className="font-mono text-lg font-semibold text-destructive">₹{totalExpense.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Net Cash Flow</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{(totalIncome - totalExpense).toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Pending Splits</p>
          <p className="font-mono text-lg font-semibold text-warning">₹{splits.reduce((s, x) => s + x.amount, 0).toLocaleString("en-IN")}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {(["transactions", "budgets", "splits"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm capitalize transition-colors border-b-2 ${
              activeTab === tab ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {activeTab === "transactions" && (
        <motion.div {...fade(0.05)} className="space-y-3">
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 rounded-button bg-muted text-xs text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Filter size={12} /> Filter
            </button>
            <button className="h-8 px-3 rounded-button bg-muted text-xs text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Camera size={12} /> Scan Receipt
            </button>
          </div>
          <div className="space-y-1">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card rounded-card p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-button bg-muted flex items-center justify-center">
                  {typeIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{tx.sub}</p>
                    {tx.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{tx.category} · {tx.method} · {tx.date}</p>
                </div>
                <p className={`font-mono text-sm font-semibold ${tx.type === "income" || tx.type === "refund" ? "text-success" : "text-foreground"}`}>
                  {tx.type === "income" || tx.type === "refund" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Budget Envelopes */}
      {activeTab === "budgets" && (
        <motion.div {...fade(0.05)} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {budgetEnvelopes.map((b, i) => {
            const pct = Math.round((b.spent / b.cap) * 100);
            const isOver = b.spent > b.cap;
            const isNear = pct >= 90 && !isOver;
            return (
              <motion.div
                key={b.category}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{b.icon}</span>
                    <span className="text-sm font-medium text-foreground">{b.category}</span>
                  </div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${isOver ? "bg-destructive/20 text-destructive" : isNear ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"}`}>
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isOver ? "bg-destructive" : isNear ? "bg-warning" : "bg-accent-light"}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">₹{b.spent.toLocaleString("en-IN")} spent</span>
                  <span className="font-mono">
                    {isOver
                      ? <span className="text-destructive">OVER by ₹{(b.spent - b.cap).toLocaleString("en-IN")}</span>
                      : `₹${(b.cap - b.spent).toLocaleString("en-IN")} left`
                    }
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Splits */}
      {activeTab === "splits" && (
        <motion.div {...fade(0.05)} className="space-y-3">
          <p className="text-sm text-muted-foreground">Pending receivables from split expenses</p>
          {splits.map((s, i) => (
            <motion.div
              key={s.person}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-card p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary-light">
                {s.person[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{s.person} owes you</p>
                <p className="text-xs text-muted-foreground">{s.context}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-secondary">₹{s.amount.toLocaleString("en-IN")}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.status === "Pending" ? "bg-warning/20 text-warning" : "bg-info/20 text-info"}`}>
                  {s.status}
                </span>
              </div>
            </motion.div>
          ))}
          <div className="glass-card rounded-card p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total Receivable</span>
            <span className="font-mono text-lg font-semibold text-secondary">₹{splits.reduce((s, x) => s + x.amount, 0).toLocaleString("en-IN")}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Budgeting;
