import { motion } from "framer-motion";
import { Plus, MoreVertical } from "lucide-react";

export function GoalsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card rounded-card p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-sm">Stay on Track with Your Goals</h3>
        <button className="w-7 h-7 rounded-button bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Visualize your progress toward savings, investments, or debt repayment goals.
      </p>
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs text-accent-light font-mono">+$324</span>
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="text-primary-light">
          <path d="M0 25 Q15 20 25 15 T50 8 L60 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="58" cy="5" r="3" fill="hsl(280, 60%, 55%)" />
        </svg>
      </div>
    </motion.div>
  );
}

export function CashFlowCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-card p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-sm">Cash Flow</h3>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Income</span>
          <span className="font-mono text-accent-light">$2,000.00</span>
          <span className="font-mono text-muted-foreground">/ $3,200.00</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent-light rounded-full" style={{ width: "62.5%" }} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-light" />
            Earned
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-muted-foreground" />
            Goal
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SendToCard() {
  const contacts = [
    { name: "Jozy D.", initials: "JD" },
    { name: "Mike W.", initials: "MW" },
    { name: "Ody U.", initials: "OU" },
    { name: "Ann K.", initials: "AK" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card rounded-card p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground text-sm">Send to</h3>
          <p className="text-xs text-muted-foreground">Last Recipients</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-accent-light border border-dashed border-border">
            <Plus size={16} />
          </div>
          <span className="text-[10px] text-accent-light">Add</span>
        </button>
        {contacts.map((c) => (
          <button key={c.name} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
              {c.initials}
            </div>
            <span className="text-[10px] text-muted-foreground">{c.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
