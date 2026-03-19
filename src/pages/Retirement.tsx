import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Heart, Sliders } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { formatINR } from "@/store/financeStore";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const retirementAssets = [
  { name: "EPF", value: 850000, color: "hsl(217, 91%, 60%)" },
  { name: "PPF", value: 480000, color: "hsl(160, 84%, 39%)" },
  { name: "NPS", value: 240000, color: "hsl(280, 60%, 55%)" },
  { name: "Equity MFs", value: 1200000, color: "hsl(38, 96%, 44%)" },
];

const bucketStrategy = [
  { name: "Bucket 1 (0-3yr)", desc: "FD / Liquid Funds", amount: "₹90L", risk: "Safe" },
  { name: "Bucket 2 (3-7yr)", desc: "Balanced / Hybrid MF → SWP", amount: "₹1.5 Cr", risk: "Moderate" },
  { name: "Bucket 3 (7+yr)", desc: "Equity — long-term growth", amount: "₹5.1 Cr", risk: "Growth" },
];

const chartTooltipStyle = {
  background: "hsl(220, 47%, 11%)",
  border: "1px solid hsl(217, 19%, 27%)",
  borderRadius: "8px",
  color: "hsl(210, 20%, 98%)",
  fontSize: "12px",
};

// Interactive FIRE Calculator
function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState(28);
  const [retireAge, setRetireAge] = useState(45);
  const [monthlyExpenses, setMonthlyExpenses] = useState(80000);
  const [inflationRate, setInflationRate] = useState(7);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [currentCorpus, setCurrentCorpus] = useState(2770000);
  const [swr, setSwr] = useState(4);

  const years = retireAge - currentAge;
  const expensesAtRetire = Math.round(monthlyExpenses * Math.pow(1 + inflationRate / 100, years));
  const annualExpensesAtRetire = expensesAtRetire * 12;
  const corpusNeeded = Math.round(annualExpensesAtRetire / (swr / 100));
  const fvExisting = Math.round(currentCorpus * Math.pow(1 + expectedReturn / 100, years));
  const gap = Math.max(corpusNeeded - fvExisting, 0);

  // Calculate required monthly SIP using FV of annuity formula
  const r = expectedReturn / 100 / 12;
  const n = years * 12;
  const sipNeeded = gap > 0 ? Math.round(gap * r / (Math.pow(1 + r, n) - 1)) : 0;

  const progress = Math.min(Math.round((fvExisting / corpusNeeded) * 100), 100);

  return (
    <motion.div {...fade(0.05)} className="glass-card rounded-card p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Sliders size={14} className="text-primary-light" /> Interactive FIRE Calculator
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          {[
            { label: "Current Age", value: currentAge, set: setCurrentAge, min: 20, max: 55, step: 1, suffix: "" },
            { label: "Retire At", value: retireAge, set: setRetireAge, min: 30, max: 65, step: 1, suffix: "" },
            { label: "Monthly Expenses", value: monthlyExpenses, set: setMonthlyExpenses, min: 20000, max: 500000, step: 5000, suffix: "", format: true },
            { label: "Inflation Rate", value: inflationRate, set: setInflationRate, min: 3, max: 12, step: 0.5, suffix: "%" },
            { label: "Expected Return", value: expectedReturn, set: setExpectedReturn, min: 6, max: 18, step: 0.5, suffix: "%" },
            { label: "Safe Withdrawal Rate", value: swr, set: setSwr, min: 2, max: 6, step: 0.5, suffix: "%" },
            { label: "Current Corpus", value: currentCorpus, set: setCurrentCorpus, min: 0, max: 20000000, step: 100000, suffix: "", format: true },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                <span>{s.label}</span>
                <span className="font-mono text-foreground">
                  {(s as any).format ? formatINR(s.value, true) : `${s.value}${s.suffix}`}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={(e) => s.set(parseFloat(e.target.value))} className="w-full accent-primary h-1.5" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-button">
              <p className="text-xs text-muted-foreground">FIRE Corpus</p>
              <p className="font-mono text-lg font-semibold text-foreground">{formatINR(corpusNeeded, true)}</p>
            </div>
            <div className="p-3 bg-muted rounded-button">
              <p className="text-xs text-muted-foreground">Expenses at {retireAge}</p>
              <p className="font-mono text-lg font-semibold text-foreground">{formatINR(expensesAtRetire)}/mo</p>
            </div>
            <div className="p-3 bg-muted rounded-button">
              <p className="text-xs text-muted-foreground">FV of Current</p>
              <p className="font-mono text-lg font-semibold text-accent-light">{formatINR(fvExisting, true)}</p>
            </div>
            <div className="p-3 bg-muted rounded-button">
              <p className="text-xs text-muted-foreground">Gap to Fill</p>
              <p className="font-mono text-lg font-semibold text-warning">{formatINR(gap, true)}</p>
            </div>
          </div>

          <div className="p-4 bg-primary/10 rounded-button space-y-2">
            <p className="text-sm text-primary-light font-semibold">Monthly SIP Needed</p>
            <p className="font-mono text-2xl font-bold text-foreground">{formatINR(sipNeeded)}</p>
            <p className="text-[10px] text-muted-foreground">+ 10% annual step-up recommended</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-mono text-foreground">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent-light rounded-full transition-all"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const Retirement = () => {
  const currentCorpus = retirementAssets.reduce((s, a) => s + a.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Retirement Planning</h1>
      </div>

      <FIRECalculator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Retirement Assets */}
        <motion.div {...fade(0.1)} className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Current Retirement Assets</h3>
          <div className="glass-card rounded-card p-4">
            <div className="h-40 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={retirementAssets} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(218, 11%, 65%)", fontSize: 11 }} width={70} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => formatINR(value)} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {retirementAssets.map((a, i) => <Cell key={i} fill={a.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-sm text-foreground">Total</span>
              <span className="font-mono text-sm font-semibold text-foreground">{formatINR(currentCorpus)}</span>
            </div>
          </div>

          <div className="glass-card rounded-card p-4 space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Monthly Action Plan</h4>
            <div className="space-y-1 text-xs">
              {[
                { label: "Equity SIP", amount: 50000 },
                { label: "VPF Contribution", amount: 10000 },
                { label: "NPS Monthly", amount: 12500 },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-mono text-foreground">{formatINR(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bucket Strategy & Risks */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Post-Retirement: Bucket Strategy</h3>
          <motion.div {...fade(0.15)} className="space-y-2">
            {bucketStrategy.map((b) => (
              <div key={b.name} className="glass-card rounded-card p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{b.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    b.risk === "Safe" ? "bg-accent/20 text-accent-light" :
                    b.risk === "Moderate" ? "bg-secondary/20 text-secondary" :
                    "bg-primary/20 text-primary-light"
                  }`}>{b.risk}</span>
                </div>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
                <p className="font-mono text-sm text-foreground">{b.amount}</p>
              </div>
            ))}
          </motion.div>

          <motion.div {...fade(0.25)} className="glass-card rounded-card p-4 border border-warning/30 space-y-2">
            <h4 className="text-sm font-semibold text-warning flex items-center gap-2"><AlertTriangle size={14} /> Sequence of Returns Risk</h4>
            <p className="text-xs text-muted-foreground">A 30% crash in year 1 of retirement can permanently deplete corpus even if average returns are fine.</p>
            <div className="text-xs space-y-1">
              <p className="text-foreground">Mitigation:</p>
              <p className="text-muted-foreground">• 3 years safe in Bucket 1</p>
              <p className="text-muted-foreground">• Reduce withdrawal in crash years</p>
              <p className="text-muted-foreground">• Over-save by 10-20%</p>
            </div>
          </motion.div>

          <motion.div {...fade(0.3)} className="glass-card rounded-card p-4 border border-destructive/30 space-y-2">
            <h4 className="text-sm font-semibold text-destructive flex items-center gap-2"><Heart size={14} /> Healthcare Cost Inflation</h4>
            <p className="text-xs text-muted-foreground">Medical inflation: 12% p.a. Current ₹50K/yr → ₹17.95L/yr at age 60.</p>
            <p className="text-xs text-foreground">Separate health corpus needed: <span className="font-mono text-destructive">₹2-3 Cr</span></p>
            <p className="text-xs text-accent-light">Strategy: Super top-up ₹50L + dedicated health fund SIP ₹5K/mo</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Retirement;
