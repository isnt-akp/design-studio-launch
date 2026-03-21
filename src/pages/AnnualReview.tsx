import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Circle, AlertTriangle, Calendar } from "lucide-react";
import { useFinanceStore, formatINR } from "@/store/financeStore";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

interface ReviewItem {
  id: string;
  layer: string;
  task: string;
  description: string;
}

const reviewChecklist: ReviewItem[] = [
  { id: "r1", layer: "Budgeting", task: "Reset monthly budget envelopes", description: "Review last year's spending patterns and set new caps for each category based on goals." },
  { id: "r2", layer: "Budgeting", task: "Clear pending splits & IOUs", description: "Settle all outstanding receivables and payables from the previous year." },
  { id: "r3", layer: "Savings", task: "Top up emergency fund to 6 months", description: "Verify emergency fund covers 6 months of expenses. Move idle cash to Liquid MF." },
  { id: "r4", layer: "Savings", task: "Renew FD ladder", description: "Roll over maturing FDs and update rates based on current offerings." },
  { id: "r5", layer: "Investing", task: "Rebalance portfolio allocation", description: "Check actual vs target allocation (60:30:10). Sell overweight, buy underweight." },
  { id: "r6", layer: "Investing", task: "Review SIP step-up", description: "Increase SIP amounts by 10% in line with income growth." },
  { id: "r7", layer: "Investing", task: "Tax-loss harvesting", description: "Book STCL before March 31 to offset gains. Rebuy after 1 day." },
  { id: "r8", layer: "Debt", task: "Evaluate loan prepayment", description: "Run Prepay vs Invest calculator. Consider annual ₹1L home loan prepayment." },
  { id: "r9", layer: "Debt", task: "Pay off BNPL balances", description: "Clear all Buy Now Pay Later balances to avoid hidden interest charges." },
  { id: "r10", layer: "Tax", task: "Choose tax regime for new FY", description: "Run Old vs New regime comparison with updated salary and deductions." },
  { id: "r11", layer: "Tax", task: "File ITR before July 31", description: "Gather Form 16, AIS, capital gains statements, and file return." },
  { id: "r12", layer: "Tax", task: "Max out 80C & 80D deductions", description: "Verify PPF, ELSS, EPF fill 80C. Health insurance fills 80D." },
  { id: "r13", layer: "Insurance", task: "Review sum assured adequacy", description: "Term life should be 15-20× annual income. Health cover should account for inflation." },
  { id: "r14", layer: "Insurance", task: "Renew expiring policies", description: "Check motor, home, and health policy renewal dates." },
  { id: "r15", layer: "Insurance", task: "Review underperforming policies", description: "Evaluate LIC endowments — consider making paid-up and redirecting to MFs." },
  { id: "r16", layer: "Retirement", task: "Update FIRE calculator inputs", description: "Adjust current corpus, expenses, and inflation to re-calculate SIP needed." },
  { id: "r17", layer: "Retirement", task: "Review NPS allocation", description: "Rebalance NPS between equity/corporate bonds/government securities." },
  { id: "r18", layer: "Estate", task: "Update nominee records", description: "Verify all bank accounts, demat, insurance, and MF accounts have updated nominees." },
  { id: "r19", layer: "Estate", task: "Review Will & PoA", description: "Update Will for any new assets. Verify Power of Attorney is current." },
  { id: "r20", layer: "Estate", task: "Update digital asset inventory", description: "Add new platforms, update access methods, and store securely." },
  { id: "r21", layer: "Goals", task: "Review goal progress", description: "Check each goal's on-track status. Adjust monthly contributions if behind." },
  { id: "r22", layer: "Goals", task: "Link new investments to goals", description: "Map any new SIPs or investments to specific financial goals." },
];

const AnnualReview = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    // Persist checklist state in localStorage
    try {
      const saved = localStorage.getItem("arthavault_review_completed");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const nw = useFinanceStore(s => s.netWorth)();
  const sr = useFinanceStore(s => s.savingsRate)();

  const toggle = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("arthavault_review_completed", JSON.stringify([...next]));
      return next;
    });
  };

  const layers = [...new Set(reviewChecklist.map(r => r.layer))];
  const completedCount = completed.size;
  const totalCount = reviewChecklist.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  // Check if April 1st is approaching
  const now = new Date();
  const isReviewSeason = now.getMonth() >= 2 && now.getMonth() <= 3; // March-April

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Annual Financial Review</h1>
        <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar size={14} /> April 1st Checklist</span>
      </div>

      {isReviewSeason && (
        <motion.div {...fade()} className="p-3 bg-warning/10 rounded-card border border-warning/30 flex items-center gap-2">
          <AlertTriangle size={16} className="text-warning shrink-0" />
          <p className="text-xs text-warning">Annual review season is here! Complete all items before April 15th to start FY 2026-27 organized.</p>
        </motion.div>
      )}

      {/* Progress */}
      <motion.div {...fade()} className="glass-card rounded-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">FY 2025-26 Review Progress</p>
            <p className="text-xs text-muted-foreground">{completedCount} of {totalCount} tasks completed</p>
          </div>
          <span className="font-mono text-2xl font-bold text-foreground">{pct}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent-light rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-muted rounded-button">
            <p className="text-xs text-muted-foreground">Current Net Worth</p>
            <p className="font-mono text-sm font-semibold text-foreground">{formatINR(nw, true)}</p>
          </div>
          <div className="p-3 bg-muted rounded-button">
            <p className="text-xs text-muted-foreground">Savings Rate</p>
            <p className="font-mono text-sm font-semibold text-success">{sr}%</p>
          </div>
          <div className="p-3 bg-muted rounded-button">
            <p className="text-xs text-muted-foreground">Review Status</p>
            <p className="text-sm font-semibold text-foreground">{pct === 100 ? "✅ Complete" : pct > 50 ? "🔄 In Progress" : "⏳ Not Started"}</p>
          </div>
        </div>
      </motion.div>

      {/* Checklist by layer */}
      {layers.map((layer, li) => {
        const items = reviewChecklist.filter(r => r.layer === layer);
        const layerCompleted = items.filter(r => completed.has(r.id)).length;

        return (
          <motion.div key={layer} {...fade(0.05 + li * 0.03)} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{layer}</h3>
              <span className="text-xs text-muted-foreground font-mono">{layerCompleted}/{items.length}</span>
            </div>
            {items.map((item) => {
              const done = completed.has(item.id);
              return (
                <button key={item.id} onClick={() => toggle(item.id)}
                  className={`w-full glass-card rounded-card p-4 flex items-start gap-3 text-left transition-colors ${done ? "opacity-60" : "hover:bg-muted/50"}`}>
                  {done ? <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" /> : <Circle size={18} className="text-muted-foreground shrink-0 mt-0.5" />}
                  <div>
                    <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.task}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        );
      })}

      {pct === 100 && (
        <motion.div {...fade(0.3)} className="glass-card rounded-card p-6 text-center space-y-2 border border-success/30">
          <p className="text-2xl">🎉</p>
          <p className="text-lg font-semibold text-success">Annual Review Complete!</p>
          <p className="text-xs text-muted-foreground">Your finances are organized for FY 2026-27. Next review: April 1, 2027.</p>
        </motion.div>
      )}
    </div>
  );
};

export default AnnualReview;
