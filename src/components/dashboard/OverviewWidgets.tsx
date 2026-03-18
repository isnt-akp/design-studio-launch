import { motion } from "framer-motion";
import { Fingerprint, ArrowUpRight, MoreVertical } from "lucide-react";

export function BudgetCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-3"
    >
      <div className="card-purple-gradient rounded-card p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 300 200" className="w-full h-full">
            <circle cx="250" cy="30" r="100" fill="white" fillOpacity="0.08" />
          </svg>
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tracking-widest text-foreground/80">**** 9154</span>
            <span className="font-mono text-xs text-foreground/70">12/24</span>
            <div className="flex -space-x-1.5">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-80" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-foreground/20 flex items-center justify-center text-[9px] font-semibold">EK</div>
            <span className="text-[11px] text-foreground/70">Eva K.</span>
          </div>
          <p className="text-xs text-foreground/70 mt-1">Total Budget</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">$2,320</span>
            <span className="text-lg text-foreground/60">.00</span>
            <span className="ml-auto text-xs flex items-center gap-1">🇺🇸 USD</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="flex-1 h-9 rounded-button bg-foreground/10 text-foreground/80 flex items-center justify-center transition-colors hover:bg-foreground/20">
              <Fingerprint size={16} />
            </button>
            <button className="flex-1 h-9 rounded-button bg-foreground/10 text-foreground/80 flex items-center justify-center transition-colors hover:bg-foreground/20">
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SavingsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-card p-4 flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-card bg-secondary/20 flex items-center justify-center text-lg">💰</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">Savings</p>
        <p className="font-mono text-sm text-muted-foreground">€0.00</p>
      </div>
      <div className="flex gap-1.5">
        <button className="w-8 h-8 rounded-button bg-muted flex items-center justify-center text-accent-light hover:bg-accent/20 transition-colors">
          <ArrowUpRight size={14} />
        </button>
        <button className="w-8 h-8 rounded-button bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Fingerprint size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export function WeeklyOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-card p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-primary rounded-full" />
          <h3 className="font-semibold text-foreground">Weekly Financial Overview</h3>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-card p-3 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-button bg-primary/20 flex items-center justify-center text-primary-light">
              <ArrowUpRight size={14} className="rotate-180" />
            </div>
            <span className="text-xs text-destructive">(-19%)</span>
          </div>
          <p className="text-xs text-muted-foreground">Income</p>
          <p className="font-mono font-semibold text-foreground">$2,300<span className="text-muted-foreground">.00</span></p>
        </div>
        <div className="glass-card rounded-card p-3 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-button bg-accent/20 flex items-center justify-center text-accent-light">
              <ArrowUpRight size={14} />
            </div>
            <span className="text-xs text-accent-light">(+5%)</span>
          </div>
          <p className="text-xs text-muted-foreground">Expenses</p>
          <p className="font-mono font-semibold text-foreground">$2,450<span className="text-muted-foreground">.00</span></p>
        </div>
        <div className="glass-card rounded-card p-3 space-y-1">
          <div className="w-7 h-7 rounded-button bg-accent/20 flex items-center justify-center text-accent-light">
            <Fingerprint size={14} />
          </div>
          <p className="text-xs text-muted-foreground">Savings</p>
          <p className="font-mono text-sm text-accent-light">+$320</p>
        </div>
        <div className="glass-card rounded-card p-3 space-y-1">
          <div className="w-7 h-7 rounded-button bg-secondary/20 flex items-center justify-center text-secondary-light">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></svg>
          </div>
          <p className="text-xs text-muted-foreground">Top Spend Day</p>
          <p className="font-mono text-sm text-foreground">Wed - <span className="text-destructive">$480</span></p>
        </div>
      </div>
    </motion.div>
  );
}
