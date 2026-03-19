import { motion } from "framer-motion";
import { useState } from "react";
import { Calculator, FileText, ArrowLeftRight, Sliders } from "lucide-react";
import { formatINR } from "@/store/financeStore";

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

// Interactive old vs new regime calculator
function computeOldRegimeTax(gross: number, totalDeductions: number): number {
  const taxable = Math.max(gross - totalDeductions, 0);
  // Old regime slabs
  let tax = 0;
  if (taxable > 1000000) tax += (taxable - 1000000) * 0.30;
  if (taxable > 500000) tax += Math.min(taxable - 500000, 500000) * 0.20;
  if (taxable > 250000) tax += Math.min(taxable - 250000, 250000) * 0.05;
  return Math.round(tax);
}

function computeNewRegimeTax(gross: number): number {
  const stdDeduction = 75000;
  const npsEmployer = 87500;
  const taxable = Math.max(gross - stdDeduction - npsEmployer, 0);
  // New regime slabs (2024+)
  let tax = 0;
  if (taxable > 1500000) tax += (taxable - 1500000) * 0.30;
  if (taxable > 1200000) tax += Math.min(taxable - 1200000, 300000) * 0.20;
  if (taxable > 1000000) tax += Math.min(taxable - 1000000, 200000) * 0.15;
  if (taxable > 700000) tax += Math.min(taxable - 700000, 300000) * 0.10;
  if (taxable > 300000) tax += Math.min(taxable - 300000, 400000) * 0.05;
  return Math.round(tax);
}

const TaxPlanning = () => {
  const [regime, setRegime] = useState<"old" | "new">("old");
  const [grossSalary, setGrossSalary] = useState(1800000);
  const [activeTab, setActiveTab] = useState<"comparison" | "deductions" | "gains">("comparison");

  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const oldTax = computeOldRegimeTax(grossSalary, totalDeductions);
  const oldCess = Math.round(oldTax * 0.04);
  const newTax = computeNewRegimeTax(grossSalary);
  const newCess = Math.round(newTax * 0.04);
  const savings = (newTax + newCess) - (oldTax + oldCess);
  const betterRegime = savings > 0 ? "old" : "new";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Tax Planning</h1>
        <span className="text-sm text-muted-foreground">FY 2025-26</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {(["comparison", "deductions", "gains"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm capitalize transition-colors border-b-2 ${
              activeTab === tab ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}>{tab === "comparison" ? "Regime Calculator" : tab === "deductions" ? "Deductions" : "Capital Gains"}</button>
        ))}
      </div>

      {activeTab === "comparison" && (
        <div className="space-y-5">
          {/* Interactive Salary Input */}
          <motion.div {...fade()} className="glass-card rounded-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary-light" />
              <h3 className="text-sm font-semibold text-foreground">Gross Annual Salary</h3>
            </div>
            <input
              type="range"
              min={500000}
              max={5000000}
              step={50000}
              value={grossSalary}
              onChange={(e) => setGrossSalary(parseInt(e.target.value))}
              className="w-full accent-primary h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹5L</span>
              <span className="font-mono text-lg text-foreground font-semibold">{formatINR(grossSalary)}</span>
              <span>₹50L</span>
            </div>
          </motion.div>

          {/* Side by side comparison */}
          <motion.div {...fade(0.05)} className="grid grid-cols-2 gap-4">
            <div className={`glass-card rounded-card p-5 space-y-3 border-2 transition-colors ${
              betterRegime === "old" ? "border-accent/50" : "border-transparent"
            }`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Old Regime</p>
                {betterRegime === "old" && <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent-light">BETTER ✅</span>}
              </div>
              <p className="text-xs text-muted-foreground">
                Taxable: <span className="font-mono text-foreground">{formatINR(Math.max(grossSalary - totalDeductions, 0))}</span>
              </p>
              <p className="font-mono text-2xl font-bold text-foreground">{formatINR(oldTax + oldCess)}</p>
              <p className="text-[10px] text-muted-foreground">Tax: {formatINR(oldTax)} + Cess: {formatINR(oldCess)}</p>
              <p className="text-xs text-muted-foreground">Deductions: {formatINR(totalDeductions)}</p>
            </div>
            <div className={`glass-card rounded-card p-5 space-y-3 border-2 transition-colors ${
              betterRegime === "new" ? "border-accent/50" : "border-transparent"
            }`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">New Regime</p>
                {betterRegime === "new" && <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent-light">BETTER ✅</span>}
              </div>
              <p className="text-xs text-muted-foreground">
                Taxable: <span className="font-mono text-foreground">{formatINR(Math.max(grossSalary - 75000 - 87500, 0))}</span>
              </p>
              <p className="font-mono text-2xl font-bold text-foreground">{formatINR(newTax + newCess)}</p>
              <p className="text-[10px] text-muted-foreground">Tax: {formatINR(newTax)} + Cess: {formatINR(newCess)}</p>
              <p className="text-xs text-muted-foreground">Only Std Ded + NPS employer</p>
            </div>
          </motion.div>

          <motion.div {...fade(0.1)} className="text-center p-3 bg-accent/10 rounded-button">
            <p className="text-sm text-accent-light font-semibold">
              {betterRegime === "old" ? "Old" : "New"} Regime saves {formatINR(Math.abs(savings))} ✅
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {betterRegime === "new" ? "You have fewer deductions — new regime works better" : "Your deductions offset the lower slab rates"}
            </p>
          </motion.div>

          {/* ITR Status */}
          <motion.div {...fade(0.15)} className="glass-card rounded-card p-4 space-y-2">
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

          {/* RSU Alert */}
          <motion.div {...fade(0.2)} className="glass-card rounded-card p-4 border border-warning/30 space-y-2">
            <h4 className="text-sm font-semibold text-warning">⚠️ RSU/ESOP Double Tax Risk</h4>
            <p className="text-xs text-muted-foreground">50 RSUs vested at ₹2,000 FMV — taxed as salary. If sold at ₹2,500, use FMV as cost basis to avoid double taxation.</p>
            <p className="text-xs text-foreground font-mono">STCG on sale: ₹5,000 (on ₹25K gain)</p>
          </motion.div>
        </div>
      )}

      {activeTab === "deductions" && (
        <motion.div {...fade(0.05)} className="space-y-3">
          {deductions.map((d) => {
            const pct = Math.round((d.amount / d.limit) * 100);
            return (
              <div key={d.section} className="glass-card rounded-card p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-primary-light">{d.section}</span>
                    <p className="text-xs text-muted-foreground">{d.items}</p>
                  </div>
                  <span className="font-mono text-sm text-foreground">{formatINR(d.amount)}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent-light rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-right">Limit: {formatINR(d.limit)}</p>
              </div>
            );
          })}
          <div className="glass-card rounded-card p-3 flex justify-between">
            <span className="text-sm font-medium text-foreground">Total Deductions</span>
            <span className="font-mono text-sm font-semibold text-accent-light">{formatINR(totalDeductions)}</span>
          </div>
        </motion.div>
      )}

      {activeTab === "gains" && (
        <motion.div {...fade(0.05)} className="space-y-4">
          <div className="glass-card rounded-card p-4 space-y-2">
            {capitalGains.map((cg) => (
              <div key={cg.type} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                <div>
                  <p className="text-foreground">{cg.type}</p>
                  <p className="text-xs text-muted-foreground">Gain: {formatINR(cg.gain)} · Rate: {cg.taxRate}</p>
                </div>
                <span className="font-mono text-destructive">{formatINR(cg.tax)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <span className="text-sm font-medium text-foreground">Total CG Tax</span>
              <span className="font-mono text-sm font-semibold text-destructive">{formatINR(capitalGains.reduce((s, c) => s + c.tax, 0))}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TaxPlanning;
