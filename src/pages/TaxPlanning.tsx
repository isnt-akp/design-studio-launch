import { motion } from "framer-motion";
import { useState } from "react";
import { Calculator, FileText, ArrowLeftRight } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const deductions = [
  { section: "80C", items: "PPF + ELSS + EPF", amount: 150000, limit: 150000 },
  { section: "80D", items: "Self ₹25K + Parents ₹50K", amount: 75000, limit: 75000 },
  { section: "80CCD(1B)", items: "NPS Additional", amount: 50000, limit: 50000 },
  { section: "Sec 24b", items: "Home Loan Interest", amount: 200000, limit: 200000 },
  { section: "HRA", items: "Rent Exemption", amount: 240000, limit: 240000 },
  { section: "Std Deduction", items: "Standard", amount: 75000, limit: 75000 },
];

const capitalGains = [
  { type: "Equity LTCG", gain: 250000, exempt: 125000, taxRate: "12.5%", tax: 15625 },
  { type: "Equity STCG", gain: 45000, exempt: 0, taxRate: "20%", tax: 9000 },
  { type: "Debt Fund", gain: 80000, exempt: 0, taxRate: "Slab (30%)", tax: 24000 },
  { type: "Dividends", gain: 15000, exempt: 0, taxRate: "Slab", tax: 4500 },
];

const TaxPlanning = () => {
  const [regime, setRegime] = useState<"old" | "new">("old");
  const grossSalary = 1800000;
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const oldTaxable = grossSalary - totalDeductions;
  const oldTax = 148200;
  const newTaxable = grossSalary - 75000 - 87500;
  const newTax = 200200;
  const savings = newTax - oldTax;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Tax Planning</h1>
        <span className="text-sm text-muted-foreground">FY 2025-26</span>
      </div>

      {/* Regime Comparison */}
      <motion.div {...fade()} className="glass-card rounded-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><ArrowLeftRight size={16} /> Old vs New Regime</h3>
          <div className="flex bg-muted rounded-button p-0.5">
            <button onClick={() => setRegime("old")} className={`px-3 py-1 text-xs rounded-sm transition-colors ${regime === "old" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Old</button>
            <button onClick={() => setRegime("new")} className={`px-3 py-1 text-xs rounded-sm transition-colors ${regime === "new" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>New</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-card border transition-colors ${regime === "old" ? "border-accent/40 bg-accent/5" : "border-border"}`}>
            <p className="text-xs text-muted-foreground mb-1">Old Regime</p>
            <p className="text-xs text-muted-foreground">Taxable: <span className="font-mono text-foreground">₹{oldTaxable.toLocaleString("en-IN")}</span></p>
            <p className="font-mono text-xl font-bold text-foreground mt-1">₹{oldTax.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground">+ 4% cess</p>
          </div>
          <div className={`p-4 rounded-card border transition-colors ${regime === "new" ? "border-accent/40 bg-accent/5" : "border-border"}`}>
            <p className="text-xs text-muted-foreground mb-1">New Regime</p>
            <p className="text-xs text-muted-foreground">Taxable: <span className="font-mono text-foreground">₹{newTaxable.toLocaleString("en-IN")}</span></p>
            <p className="font-mono text-xl font-bold text-foreground mt-1">₹{newTax.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground">+ 4% cess</p>
          </div>
        </div>
        <div className="text-center p-2 bg-accent/10 rounded-button">
          <p className="text-sm text-accent-light font-semibold">Old Regime saves ₹{savings.toLocaleString("en-IN")} ✅</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Deductions */}
        <motion.div {...fade(0.1)} className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Deductions Tracker</h3>
          {deductions.map((d, i) => {
            const pct = Math.round((d.amount / d.limit) * 100);
            return (
              <div key={d.section} className="glass-card rounded-card p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-primary-light">{d.section}</span>
                    <p className="text-xs text-muted-foreground">{d.items}</p>
                  </div>
                  <span className="font-mono text-sm text-foreground">₹{d.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent-light rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <div className="glass-card rounded-card p-3 flex justify-between">
            <span className="text-sm font-medium text-foreground">Total Deductions</span>
            <span className="font-mono text-sm font-semibold text-accent-light">₹{totalDeductions.toLocaleString("en-IN")}</span>
          </div>
        </motion.div>

        {/* Capital Gains + RSU */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Capital Gains Tax</h3>
          <motion.div {...fade(0.15)} className="glass-card rounded-card p-4 space-y-2">
            {capitalGains.map((cg) => (
              <div key={cg.type} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                <div>
                  <p className="text-foreground">{cg.type}</p>
                  <p className="text-xs text-muted-foreground">Gain: ₹{cg.gain.toLocaleString("en-IN")} · Rate: {cg.taxRate}</p>
                </div>
                <span className="font-mono text-destructive">₹{cg.tax.toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="text-sm font-medium text-foreground">Total CG Tax</span>
              <span className="font-mono text-sm font-semibold text-destructive">₹{capitalGains.reduce((s, c) => s + c.tax, 0).toLocaleString("en-IN")}</span>
            </div>
          </motion.div>

          {/* RSU Alert */}
          <motion.div {...fade(0.2)} className="glass-card rounded-card p-4 border border-warning/30 space-y-2">
            <h4 className="text-sm font-semibold text-warning">⚠️ RSU/ESOP Double Tax Risk</h4>
            <p className="text-xs text-muted-foreground">50 RSUs vested at ₹2,000 FMV — taxed as salary. If sold at ₹2,500, use FMV as cost basis to avoid double taxation.</p>
            <p className="text-xs text-foreground font-mono">Perquisite tax: Already deducted in payslip</p>
            <p className="text-xs text-foreground font-mono">STCG on sale: ₹5,000 (on ₹25K gain)</p>
          </motion.div>

          {/* ITR Status */}
          <motion.div {...fade(0.25)} className="glass-card rounded-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary-light" />
              <h4 className="text-sm font-semibold text-foreground">ITR Filing Status</h4>
            </div>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>TDS (salary): ₹1,50,000 · TDS (FD): ₹5,200 · Advance tax: ₹15,000</p>
              <p>Total pre-paid: <span className="font-mono text-foreground">₹1,70,200</span></p>
              <p className="text-success font-semibold">Refund due: ₹3,040 🎉</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TaxPlanning;
