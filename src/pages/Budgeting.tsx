import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Filter, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, RotateCcw, Users } from "lucide-react";
import { TransactionForm } from "@/components/budgeting/TransactionForm";
import { SplitExpenseForm } from "@/components/budgeting/SplitExpenseForm";
import { useFinanceStore, formatINR } from "@/store/financeStore";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

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
  const [showTxForm, setShowTxForm] = useState(false);
  const [showSplitForm, setShowSplitForm] = useState(false);

  const transactions = useFinanceStore(s => s.transactions);
  const budgetEnvelopes = useFinanceStore(s => s.budgetEnvelopes);
  const splits = useFinanceStore(s => s.splits);
  const totalReceivables = useFinanceStore(s => s.totalReceivables)();
  const totalPayables = useFinanceStore(s => s.totalPayables)();
  const settleSplit = useFinanceStore(s => s.settleSplit);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      {showTxForm && <TransactionForm onClose={() => setShowTxForm(false)} />}
      {showSplitForm && <SplitExpenseForm onClose={() => setShowSplitForm(false)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Budgeting & Cash Flow</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowSplitForm(true)}
            className="h-9 px-4 rounded-button bg-muted text-foreground text-sm font-medium flex items-center gap-2 hover:bg-border transition-colors">
            <Users size={16} /> Split
          </button>
          <button onClick={() => setShowTxForm(true)}
            className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Income</p>
          <p className="font-mono text-lg font-semibold text-success">{formatINR(totalIncome)}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Expenses</p>
          <p className="font-mono text-lg font-semibold text-destructive">{formatINR(totalExpense)}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Net Cash Flow</p>
          <p className="font-mono text-lg font-semibold text-foreground">{formatINR(totalIncome - totalExpense)}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Receivables / Payables</p>
          <p className="font-mono text-sm font-semibold text-success">+{formatINR(totalReceivables)}</p>
          <p className="font-mono text-sm font-semibold text-warning">-{formatINR(totalPayables)}</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {(["transactions", "budgets", "splits"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm capitalize transition-colors border-b-2 ${
              activeTab === tab ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}>{tab}</button>
        ))}
      </div>

      {/* Transaction List */}
      {activeTab === "transactions" && (
        <motion.div {...fade(0.05)} className="space-y-3">
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 rounded-button bg-muted text-xs text-muted-foreground flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Filter size={12} /> Filter
            </button>
          </div>
          <div className="space-y-1">
            {transactions.map((tx, i) => (
              <motion.div key={tx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="glass-card rounded-card p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-button bg-muted flex items-center justify-center">{typeIcon(tx.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{tx.subCategory}</p>
                    {tx.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{tx.category} · {tx.method} · {tx.date}</p>
                </div>
                <p className={`font-mono text-sm font-semibold ${tx.type === "income" || tx.type === "refund" ? "text-success" : "text-foreground"}`}>
                  {tx.type === "income" || tx.type === "refund" ? "+" : "-"}{formatINR(tx.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Budget Envelopes - auto-populated with EMIs from Debt layer */}
      {activeTab === "budgets" && (
        <motion.div {...fade(0.05)} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {budgetEnvelopes.map((b, i) => {
            const pct = Math.round((b.spent / b.cap) * 100);
            const isOver = b.spent > b.cap;
            const isNear = pct >= 90 && !isOver;
            return (
              <motion.div key={b.category} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass-card rounded-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{b.icon}</span>
                    <div>
                      <span className="text-sm font-medium text-foreground">{b.category}</span>
                      {b.isFixed && <span className="text-[10px] ml-2 px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Auto from Debt Layer</span>}
                    </div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${isOver ? "bg-destructive/20 text-destructive" : isNear ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground"}`}>
                    {pct}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${isOver ? "bg-destructive" : isNear ? "bg-warning" : "bg-accent-light"}`}
                    style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{formatINR(b.spent)} spent</span>
                  <span className="font-mono">
                    {isOver ? <span className="text-destructive">OVER by {formatINR(b.spent - b.cap)}</span> : `${formatINR(b.cap - b.spent)} left`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Splits — IOUs that count toward Net Worth */}
      {activeTab === "splits" && (
        <motion.div {...fade(0.05)} className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Pending receivables count as assets · Payables as liabilities</p>
            <button onClick={() => setShowSplitForm(true)} className="text-xs text-primary-light hover:underline">+ New Split</button>
          </div>
          {splits.filter(s => s.status !== "Settled").map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card rounded-card p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${
                s.isPayable ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary-light"
              }`}>
                {s.person[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {s.isPayable ? `You owe ${s.person}` : `${s.person} owes you`}
                </p>
                <p className="text-xs text-muted-foreground">{s.context}</p>
              </div>
              <div className="text-right space-y-1">
                <p className={`font-mono text-sm font-semibold ${s.isPayable ? "text-warning" : "text-secondary"}`}>
                  {formatINR(s.amount)}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.status === "Pending" ? "bg-warning/20 text-warning" : "bg-info/20 text-info"}`}>
                    {s.status}
                  </span>
                  <button onClick={() => settleSplit(s.id)} className="text-[10px] px-1.5 py-0.5 rounded bg-success/20 text-success hover:bg-success/30 transition-colors">
                    Settle
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="glass-card rounded-card p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Net Position</span>
            <span className="font-mono text-lg font-semibold text-success">+{formatINR(totalReceivables - totalPayables)}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Budgeting;
