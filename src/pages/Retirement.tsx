import { motion } from "framer-motion";
import { Target, TrendingUp, AlertTriangle, Heart } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

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

const Retirement = () => {
  const currentAge = 28;
  const fireAge = 45;
  const years = fireAge - currentAge;
  const monthlyExpenses = 80000;
  const inflationRate = 7;
  const expensesAtRetire = Math.round(monthlyExpenses * Math.pow(1 + inflationRate / 100, years));
  const corpusNeeded = Math.round(expensesAtRetire * 12 * 25);
  const currentCorpus = retirementAssets.reduce((s, a) => s + a.value, 0);
  const fvExisting = 18900000;
  const gap = corpusNeeded - fvExisting;
  const sipNeeded = 72000;
  const progress = Math.round((currentCorpus / corpusNeeded) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Retirement Planning</h1>
        <span className="text-sm text-muted-foreground">FIRE Target: Age {fireAge}</span>
      </div>

      {/* Summary */}
      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">FIRE Corpus Needed</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{(corpusNeeded / 10000000).toFixed(1)} Cr</p>
          <p className="text-[10px] text-muted-foreground">4% rule · ₹{(expensesAtRetire / 1000).toFixed(0)}K/mo at {fireAge}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Current Corpus</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{(currentCorpus / 100000).toFixed(1)}L</p>
          <p className="text-[10px] text-muted-foreground">FV in {years}yr @ 12%: ₹{(fvExisting / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Gap to Fill</p>
          <p className="font-mono text-lg font-semibold text-warning">₹{(gap / 10000000).toFixed(2)} Cr</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Monthly SIP Needed</p>
          <p className="font-mono text-lg font-semibold text-primary-light">₹{sipNeeded.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-muted-foreground">+ 10% annual step-up</p>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div {...fade(0.05)} className="glass-card rounded-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">FIRE Progress</h3>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent-light rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Age {currentAge} — ₹{(currentCorpus / 100000).toFixed(1)}L</span>
          <span className="font-mono text-foreground">{progress}%</span>
          <span>Age {fireAge} — ₹{(corpusNeeded / 10000000).toFixed(1)} Cr</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Retirement Assets */}
        <motion.div {...fade(0.1)} className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Retirement Assets</h3>
          <div className="glass-card rounded-card p-4">
            <div className="h-40 mb-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={retirementAssets} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(218, 11%, 65%)", fontSize: 11 }} width={70} />
                  <Tooltip contentStyle={{ background: "hsl(220, 47%, 11%)", border: "1px solid hsl(217, 19%, 27%)", borderRadius: "8px", color: "hsl(210, 20%, 98%)", fontSize: "12px" }}
                    formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {retirementAssets.map((a, i) => <Cell key={i} fill={a.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-sm text-foreground">Total</span>
              <span className="font-mono text-sm font-semibold text-foreground">₹{currentCorpus.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* SIP Action Plan */}
          <div className="glass-card rounded-card p-4 space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Monthly Action Plan</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Equity SIP</span>
                <span className="font-mono text-foreground">₹50,000</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">VPF Contribution</span>
                <span className="font-mono text-foreground">₹10,000</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">NPS Monthly</span>
                <span className="font-mono text-foreground">₹12,500</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bucket Strategy & Risks */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Post-Retirement: Bucket Strategy</h3>
          <motion.div {...fade(0.15)} className="space-y-2">
            {bucketStrategy.map((b, i) => (
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

          {/* Risks */}
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
