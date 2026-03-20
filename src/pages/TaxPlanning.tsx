import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, Sliders } from "lucide-react";
import { useFinanceStore, formatINR } from "@/store/financeStore";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const capitalGains = [
  { type: "Equity LTCG", gain: 250000, exempt: 125000, taxRate: "12.5%", tax: 15625 },
  { type: "Equity STCG", gain: 45000, exempt: 0, taxRate: "20%", tax: 9000 },
  { type: "Debt Fund", gain: 80000, exempt: 0, taxRate: "Slab (30%)", tax: 24000 },
  { type: "Dividends", gain: 15000, exempt: 0, taxRate: "Slab", tax: 4500 },
];

function computeOldRegimeTax(gross: number, totalDeductions: number): number {
  const taxable = Math.max(gross - totalDeductions, 0);
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
  let tax = 0;
  if (taxable > 1500000) tax += (taxable - 1500000) * 0.30;
  if (taxable > 1200000) tax += Math.min(taxable - 1200000, 300000) * 0.20;
  if (taxable > 1000000) tax += Math.min(taxable - 1000000, 200000) * 0.15;
  if (taxable > 700000) tax += Math.min(taxable - 700000, 300000) * 0.10;
  if (taxable > 300000) tax += Math.min(taxable - 300000, 400000) * 0.05;
  return Math.round(tax);
}

const TaxPlanning = () => {
  const grossSalary = useFinanceStore(s => s.grossSalary);
  const updateGrossSalary = useFinanceStore(s => s.updateGrossSalary);
  const taxDeductions = useFinanceStore(s => s.taxDeductions);
  const total80D = useFinanceStore(s => s.total80D)();
  const insurancePolicies = useFinanceStore(s => s.insurancePolicies);

  const [activeTab, setActiveTab] = useState<"comparison" | "deductions" | "gains">("comparison");

  const totalDeductions = taxDeductions.reduce((s, d) => s + d.amount, 0);
  const oldTax = computeOldRegimeTax(grossSalary, totalDeductions);
  const oldCess = Math.round(oldTax * 0.04);
  const newTax = computeNewRegimeTax(grossSalary);
  const newCess = Math.round(newTax * 0.04);
  const savings = (newTax + newCess) - (oldTax + oldCess);
  const betterRegime = savings > 0 ? "old" : "new";

  // Insurance policies feeding into 80D (Layer 6 → Layer 5 wiring)
  const healthPolicies = insurancePolicies.filter(p => p.taxSection.includes("80D"));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Tax Planning</h1>
        <span className="text-sm text-muted-foreground">FY 2025-26</span>
      </div>

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
          <motion.div {...fade()} className="glass-card rounded-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-primary-light" />
              <h3 className="text-sm font-semibold text-foreground">Gross Annual Salary</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent-light">Auto-fed from Income transactions</span>
            </div>
            <input type="range" min={500000} max={5000000} step={50000} value={grossSalary}
              onChange={(e) => updateGrossSalary(parseInt(e.target.value))} className="w-full accent-primary h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹5L</span>
              <span className="font-mono text-lg text-foreground font-semibold">{formatINR(grossSalary)}</span>
              <span>₹50L</span>
            </div>
          </motion.div>

          <motion.div {...fade(0.05)} className="grid grid-cols-2 gap-4">
            <div className={`glass-card rounded-card p-5 space-y-3 border-2 transition-colors ${betterRegime === "old" ? "border-accent/50" : "border-transparent"}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Old Regime</p>
                {betterRegime === "old" && <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent-light">BETTER ✅</span>}
              </div>
              <p className="text-xs text-muted-foreground">Taxable: <span className="font-mono text-foreground">{formatINR(Math.max(grossSalary - totalDeductions, 0))}</span></p>
              <p className="font-mono text-2xl font-bold text-foreground">{formatINR(oldTax + oldCess)}</p>
              <p className="text-[10px] text-muted-foreground">Tax: {formatINR(oldTax)} + Cess: {formatINR(oldCess)}</p>
              <p className="text-xs text-muted-foreground">Deductions: {formatINR(totalDeductions)}</p>
            </div>
            <div className={`glass-card rounded-card p-5 space-y-3 border-2 transition-colors ${betterRegime === "new" ? "border-accent/50" : "border-transparent"}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">New Regime</p>
                {betterRegime === "new" && <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent-light">BETTER ✅</span>}
              </div>
              <p className="text-xs text-muted-foreground">Taxable: <span className="font-mono text-foreground">{formatINR(Math.max(grossSalary - 75000 - 87500, 0))}</span></p>
              <p className="font-mono text-2xl font-bold text-foreground">{formatINR(newTax + newCess)}</p>
              <p className="text-[10px] text-muted-foreground">Tax: {formatINR(newTax)} + Cess: {formatINR(newCess)}</p>
              <p className="text-xs text-muted-foreground">Only Std Ded + NPS employer</p>
            </div>
          </motion.div>

          <motion.div {...fade(0.1)} className="text-center p-3 bg-accent/10 rounded-button">
            <p className="text-sm text-accent-light font-semibold">
              {betterRegime === "old" ? "Old" : "New"} Regime saves {formatINR(Math.abs(savings))} ✅
            </p>
          </motion.div>
        </div>
      )}

      {activeTab === "deductions" && (
        <motion.div {...fade(0.05)} className="space-y-3">
          {taxDeductions.map((d) => {
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
                  <div className="h-full bg-accent-light rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground text-right">Limit: {formatINR(d.limit)}</p>
              </div>
            );
          })}

          {/* 80D auto-feed from Insurance Layer */}
          <div className="glass-card rounded-card p-4 border border-info/30 space-y-2">
            <h4 className="text-sm font-semibold text-info">🔗 Auto-populated from Insurance Layer</h4>
            <p className="text-xs text-muted-foreground">80D deductions are automatically updated when insurance premiums are paid.</p>
            <div className="space-y-1">
              {healthPolicies.map(p => (
                <div key={p.id} className="flex justify-between text-xs">
                  <span className="text-foreground">{p.name}</span>
                  <span className="font-mono text-muted-foreground">₹{p.premium.toLocaleString("en-IN")}/yr</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Total 80D claimed: <span className="font-mono text-accent-light">{formatINR(total80D)}</span></p>
          </div>

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
