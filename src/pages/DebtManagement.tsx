import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, MoreVertical, CreditCard, Smartphone, Sliders } from "lucide-react";
import { useFinanceStore, formatINR } from "@/store/financeStore";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const creditScore = { score: 756, rating: "Good", target: 780 };

// Home Loan Prepayment Calculator (Scenario 4.1)
function HomeLoanPrepayCalc() {
  const loans = useFinanceStore(s => s.loans);
  const [prepayAmount, setPrepayAmount] = useState(100000);
  const homeLoan = loans.find(l => l.type === "home");
  if (!homeLoan) return null;
  const r = homeLoan.rate / 100 / 12;
  const currentTenure = parseInt(homeLoan.tenure);

  // Current total interest
  const currentTotalPayment = homeLoan.emi * currentTenure;
  const currentTotalInterest = currentTotalPayment - homeLoan.outstanding;

  // After prepayment: reduced principal
  const newOutstanding = homeLoan.outstanding - prepayAmount;
  // New tenure at same EMI
  const newTenure = Math.ceil(-Math.log(1 - (newOutstanding * r) / homeLoan.emi) / Math.log(1 + r));
  const newTotalPayment = homeLoan.emi * newTenure;
  const newTotalInterest = newTotalPayment - newOutstanding;

  const tenureSaved = currentTenure - newTenure;
  const interestSaved = currentTotalInterest - newTotalInterest;

  return (
    <motion.div {...fade(0.15)} className="glass-card rounded-card p-5 space-y-4">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        🏠 Home Loan Prepayment Calculator
      </h4>
      <p className="text-xs text-muted-foreground">See how an extra lump sum reduces your loan tenure and total interest.</p>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Prepayment Amount</span>
          <span className="font-mono text-foreground">{formatINR(prepayAmount)}</span>
        </div>
        <input type="range" min={50000} max={1000000} step={25000} value={prepayAmount}
          onChange={(e) => setPrepayAmount(parseInt(e.target.value))} className="w-full accent-primary h-1.5" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-muted rounded-button">
          <p className="text-xs text-muted-foreground">Current Tenure</p>
          <p className="font-mono text-sm text-foreground">{currentTenure} months</p>
        </div>
        <div className="p-3 bg-accent/10 rounded-button">
          <p className="text-xs text-accent-light">New Tenure</p>
          <p className="font-mono text-sm text-accent-light">{newTenure} months</p>
        </div>
        <div className="p-3 bg-muted rounded-button">
          <p className="text-xs text-muted-foreground">Tenure Saved</p>
          <p className="font-mono text-sm text-success">{tenureSaved} months ({Math.round(tenureSaved / 12)} yrs)</p>
        </div>
        <div className="p-3 bg-accent/10 rounded-button">
          <p className="text-xs text-accent-light">Interest Saved</p>
          <p className="font-mono text-sm text-success">{formatINR(Math.max(interestSaved, 0), true)}</p>
        </div>
      </div>

      <p className="text-xs text-accent-light text-center">
        Prepaying {formatINR(prepayAmount)} saves {formatINR(Math.max(interestSaved, 0), true)} in interest and {tenureSaved} months ✅
      </p>
    </motion.div>
  );
}

// Prepay vs Invest Calculator (Scenario 4.7)
function PrepayVsInvestCalc() {
  const [amount, setAmount] = useState(100000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [taxBenefit, setTaxBenefit] = useState(true);
  const [equityReturn, setEquityReturn] = useState(12);
  const [horizon, setHorizon] = useState(7);

  const effectiveLoanRate = taxBenefit ? loanRate * 0.7 : loanRate;
  const prepayBenefit = Math.round(amount * (effectiveLoanRate / 100) * horizon);
  const investBenefit = Math.round(amount * Math.pow(1 + equityReturn / 100, horizon) - amount);
  const better = investBenefit > prepayBenefit ? "invest" : "prepay";

  return (
    <motion.div {...fade(0.2)} className="glass-card rounded-card p-5 space-y-4">
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Sliders size={14} className="text-info" /> Prepay vs Invest Calculator
      </h4>

      <div className="space-y-3">
        {[
          { label: "Lump sum amount", value: amount, set: setAmount, min: 50000, max: 500000, step: 10000, display: formatINR(amount) },
          { label: "Loan rate", value: loanRate, set: setLoanRate, min: 6, max: 15, step: 0.5, display: `${loanRate}%` },
          { label: "Expected equity return", value: equityReturn, set: setEquityReturn, min: 8, max: 18, step: 0.5, display: `${equityReturn}%` },
          { label: "Time horizon", value: horizon, set: setHorizon, min: 1, max: 20, step: 1, display: `${horizon} years` },
        ].map(s => (
          <div key={s.label}>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{s.label}</span>
              <span className="font-mono text-foreground">{s.display}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
              onChange={(e) => (s.set as (v: number) => void)(parseFloat(e.target.value))} className="w-full accent-primary h-1.5" />
          </div>
        ))}
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={taxBenefit} onChange={(e) => setTaxBenefit(e.target.checked)}
            className="w-3.5 h-3.5 accent-primary" />
          Has Sec 24/80C tax benefit (30% slab)
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-button border ${better === "prepay" ? "border-accent/50 bg-accent/5" : "border-border bg-muted"}`}>
          <p className="text-xs text-muted-foreground">Prepay Loan</p>
          <p className="font-mono text-sm font-semibold text-foreground">{formatINR(prepayBenefit)} saved</p>
          <p className="text-[10px] text-success">Zero risk · Guaranteed</p>
        </div>
        <div className={`p-3 rounded-button border ${better === "invest" ? "border-accent/50 bg-accent/5" : "border-border bg-muted"}`}>
          <p className="text-xs text-muted-foreground">Invest in Equity</p>
          <p className="font-mono text-sm font-semibold text-foreground">{formatINR(investBenefit)} gain</p>
          <p className="text-[10px] text-warning">Market risk</p>
        </div>
      </div>
      <p className="text-xs text-accent-light text-center">
        {better === "invest" ? "Investing wins" : "Prepaying wins"} by {formatINR(Math.abs(investBenefit - prepayBenefit))} · Hybrid: 50/50 split recommended ✅
      </p>
    </motion.div>
  );
}

const DebtManagement = () => {
  const loans = useFinanceStore(s => s.loans);
  const creditCards = useFinanceStore(s => s.creditCards);
  const bnpl = useFinanceStore(s => s.bnpl);
  const totalEmi = useFinanceStore(s => s.totalEmi)();

  const totalDebt = loans.reduce((s, l) => s + l.outstanding, 0) + creditCards.reduce((s, c) => s + c.outstanding, 0) + bnpl.reduce((s, b) => s + b.outstanding, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Debt Management</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Loan
        </button>
      </div>

      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Outstanding</p>
          <p className="font-mono text-lg font-semibold text-destructive">{formatINR(totalDebt, true)}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Monthly EMIs</p>
          <p className="font-mono text-lg font-semibold text-foreground">{formatINR(totalEmi)}</p>
          <p className="text-[10px] text-muted-foreground">→ Auto-locked in Budgeting</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Credit Score</p>
          <p className="font-mono text-lg font-semibold text-success">{creditScore.score}</p>
          <p className="text-[10px] text-muted-foreground">{creditScore.rating} · Target {creditScore.target}+</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">BNPL Due</p>
          <p className="font-mono text-lg font-semibold text-warning">{formatINR(bnpl.reduce((s, b) => s + b.outstanding, 0))}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Active Loans</h3>
          {loans.map((l, i) => {
            const paidPct = Math.round(((l.principal - l.outstanding) / l.principal) * 100);
            return (
              <motion.div key={l.id} {...fade(0.05 + i * 0.04)} className="glass-card rounded-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{l.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.lender} · {l.rate}% · {l.tenure} left</p>
                  </div>
                  <MoreVertical size={16} className="text-muted-foreground" />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">EMI: <span className="font-mono text-foreground">{formatINR(l.emi)}</span></span>
                  <span className="text-muted-foreground">Tax: <span className="text-accent-light">{l.taxBenefit}</span></span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary-light rounded-full" style={{ width: `${paidPct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{formatINR(l.outstanding)} remaining</span>
                  <span>{paidPct}% paid</span>
                </div>
              </motion.div>
            );
          })}

          <HomeLoanPrepayCalc />
          <PrepayVsInvestCalc />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Credit Cards</h3>
          {creditCards.map((c) => (
            <motion.div key={c.name} {...fade(0.1)} className="glass-card rounded-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-secondary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Due: {c.dueDate}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Outstanding: <span className="font-mono text-foreground">{formatINR(c.outstanding)}</span></span>
                <span className="text-muted-foreground">Min Due: <span className="font-mono text-warning">{formatINR(c.minDue)}</span></span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.round((c.outstanding / c.limit) * 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-destructive">Interest if not paid: {c.interest}</span>
                <span className="text-accent-light">Cashback: {formatINR(c.cashback)}</span>
              </div>
            </motion.div>
          ))}

          <h3 className="text-sm font-semibold text-foreground pt-2">BNPL Tracking</h3>
          {bnpl.map((b, i) => (
            <motion.div key={b.platform} {...fade(0.15 + i * 0.03)} className="glass-card rounded-card p-3 flex items-center gap-3">
              <Smartphone size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{b.platform}</p>
                <p className="text-xs text-muted-foreground">Due: {b.due}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-foreground">{formatINR(b.outstanding)}</p>
                {!b.autoDebit && <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/20 text-warning">Manual ⚠️</span>}
              </div>
            </motion.div>
          ))}

          <motion.div {...fade(0.25)} className="glass-card rounded-card p-4 space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Credit Score Health</h4>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-success flex items-center justify-center">
                <span className="font-mono text-lg font-bold text-success">{creditScore.score}</span>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>✅ 100% on-time payments (3 years)</p>
                <p>✅ CC utilization: 15% (&lt;30%)</p>
                <p className="text-warning">⚠️ 4 hard inquiries in 6 months</p>
                <p className="text-destructive">❌ Short credit history (3 years)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DebtManagement;
