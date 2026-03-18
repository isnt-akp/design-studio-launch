import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, AlertTriangle, TrendingDown, CreditCard, Home, Car, GraduationCap, Smartphone, MoreVertical } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const loans = [
  { name: "Home Loan", lender: "HDFC Ltd", icon: "🏠", principal: 6500000, outstanding: 6230000, rate: 8.5, emi: 52000, tenure: "228 months", taxBenefit: "Sec 24 + 80C", type: "home" },
  { name: "Car Loan", lender: "HDFC Auto", icon: "🚗", principal: 1260000, outstanding: 850000, rate: 8.75, emi: 26000, tenure: "36 months", taxBenefit: "None", type: "car" },
  { name: "Education Loan", lender: "SBI", icon: "🎓", principal: 2500000, outstanding: 2250000, rate: 9.5, emi: 32000, tenure: "84 months", taxBenefit: "Sec 80E (full interest)", type: "education" },
];

const creditCards = [
  { name: "ICICI Amazon Pay CC", limit: 300000, outstanding: 45000, minDue: 2250, dueDate: "Mar 25", interest: "42% p.a.", cashback: 2250 },
];

const bnpl = [
  { platform: "Simpl", outstanding: 3200, due: "Mar 16", autoDebit: true },
  { platform: "LazyPay", outstanding: 1800, due: "Mar 20", autoDebit: false },
  { platform: "Flipkart Pay Later", outstanding: 8500, due: "EMI ₹2,850/mo", autoDebit: true },
];

const creditScore = { score: 756, rating: "Good", target: 780 };

const DebtManagement = () => {
  const totalDebt = loans.reduce((s, l) => s + l.outstanding, 0) + creditCards.reduce((s, c) => s + c.outstanding, 0) + bnpl.reduce((s, b) => s + b.outstanding, 0);
  const totalEmi = loans.reduce((s, l) => s + l.emi, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Debt Management</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Loan
        </button>
      </div>

      {/* Summary */}
      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Outstanding</p>
          <p className="font-mono text-lg font-semibold text-destructive">₹{(totalDebt / 100000).toFixed(1)}L</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Monthly EMIs</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{totalEmi.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Credit Score</p>
          <p className="font-mono text-lg font-semibold text-success">{creditScore.score}</p>
          <p className="text-[10px] text-muted-foreground">{creditScore.rating} · Target {creditScore.target}+</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">BNPL Due</p>
          <p className="font-mono text-lg font-semibold text-warning">₹{bnpl.reduce((s, b) => s + b.outstanding, 0).toLocaleString("en-IN")}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Loans */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Active Loans</h3>
          {loans.map((l, i) => {
            const paidPct = Math.round(((l.principal - l.outstanding) / l.principal) * 100);
            return (
              <motion.div key={l.name} {...fade(0.05 + i * 0.04)} className="glass-card rounded-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{l.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.lender} · {l.rate}% · {l.tenure} left</p>
                  </div>
                  <MoreVertical size={16} className="text-muted-foreground" />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">EMI: <span className="font-mono text-foreground">₹{l.emi.toLocaleString("en-IN")}</span></span>
                  <span className="text-muted-foreground">Tax: <span className="text-accent-light">{l.taxBenefit}</span></span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary-light rounded-full" style={{ width: `${paidPct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-mono">₹{l.outstanding.toLocaleString("en-IN")} remaining</span>
                  <span>{paidPct}% paid</span>
                </div>
              </motion.div>
            );
          })}

          {/* Prepay vs Invest */}
          <motion.div {...fade(0.2)} className="glass-card rounded-card p-4 border border-info/30 space-y-2">
            <h4 className="text-sm font-semibold text-info">💡 Prepay vs Invest Decision</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-muted rounded-button">
                <p className="text-muted-foreground">Prepay Home Loan</p>
                <p className="font-mono text-foreground">Guaranteed 6% saving</p>
                <p className="text-success">Zero risk</p>
              </div>
              <div className="p-2 bg-muted rounded-button">
                <p className="text-muted-foreground">Invest in Equity</p>
                <p className="font-mono text-foreground">Expected 10% return</p>
                <p className="text-warning">Market risk</p>
              </div>
            </div>
            <p className="text-[10px] text-accent-light text-center">Hybrid: Prepay 50% + Invest 50% ✅</p>
          </motion.div>
        </div>

        {/* Credit Cards + BNPL */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Credit Cards</h3>
          {creditCards.map((c, i) => (
            <motion.div key={c.name} {...fade(0.1)} className="glass-card rounded-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-secondary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Due: {c.dueDate}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Outstanding: <span className="font-mono text-foreground">₹{c.outstanding.toLocaleString("en-IN")}</span></span>
                <span className="text-muted-foreground">Min Due: <span className="font-mono text-warning">₹{c.minDue.toLocaleString("en-IN")}</span></span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.round((c.outstanding / c.limit) * 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-destructive">Interest if not paid: {c.interest}</span>
                <span className="text-accent-light">Cashback: ₹{c.cashback}</span>
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
                <p className="font-mono text-sm text-foreground">₹{b.outstanding.toLocaleString("en-IN")}</p>
                {!b.autoDebit && <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/20 text-warning">Manual ⚠️</span>}
              </div>
            </motion.div>
          ))}

          {/* Credit Score */}
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
