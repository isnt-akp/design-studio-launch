import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, MoreVertical, ArrowUpRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const allocation = [
  { name: "Equity MFs", value: 1800000, target: 60, color: "hsl(280, 60%, 55%)" },
  { name: "Debt", value: 500000, target: 30, color: "hsl(217, 91%, 60%)" },
  { name: "Gold (SGB)", value: 200000, target: 10, color: "hsl(38, 96%, 44%)" },
];
const totalPortfolio = allocation.reduce((s, a) => s + a.value, 0);

const holdings = [
  { name: "UTI Nifty 50 Index Fund", type: "SIP", invested: 360000, current: 432000, xirr: 15.8, goal: "Retirement", platform: "Kuvera" },
  { name: "Mirae Asset ELSS Tax Saver", type: "ELSS", invested: 150000, current: 182000, xirr: 12.2, goal: "Tax Saving", platform: "Groww" },
  { name: "HDFC Bank", type: "Stock", invested: 49500, current: 54600, xirr: 10.3, goal: "Growth", platform: "Zerodha" },
  { name: "PPF", type: "PPF", invested: 480000, current: 520000, xirr: 7.1, goal: "Retirement", platform: "SBI" },
  { name: "SGB 2024-25", type: "SGB", invested: 71500, current: 84000, xirr: 11.5, goal: "Diversification", platform: "RBI" },
  { name: "NPS Tier 1", type: "NPS", invested: 240000, current: 270000, xirr: 12.5, goal: "Retirement", platform: "HDFC Pension" },
  { name: "Apple Inc (AAPL)", type: "US Stock", invested: 72187, current: 81412, xirr: 12.8, goal: "International", platform: "Vested" },
  { name: "HDFC Corporate Bond Fund", type: "Debt MF", invested: 300000, current: 328000, xirr: 6.2, goal: "Conservative", platform: "Direct" },
];

const stepUpProjection = { base: 15000, stepUp: 10, withoutStepUp: "₹1.49 Cr", withStepUp: "₹3.24 Cr" };

const Investing = () => {
  const [tab, setTab] = useState<"holdings" | "allocation" | "insights">("holdings");
  const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.current, 0);
  const totalGain = totalCurrent - totalInvested;
  const totalGainPct = ((totalGain / totalInvested) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Investments</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Investment
        </button>
      </div>

      {/* Summary */}
      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Invested</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{(totalInvested / 100000).toFixed(1)}L</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Current Value</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{(totalCurrent / 100000).toFixed(1)}L</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Gain</p>
          <p className="font-mono text-lg font-semibold text-success">+₹{totalGain.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Overall XIRR</p>
          <p className="font-mono text-lg font-semibold text-success">+{totalGainPct}%</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        {(["holdings", "allocation", "insights"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`pb-2 text-sm capitalize transition-colors border-b-2 ${tab === t ? "text-secondary border-secondary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "holdings" && (
        <motion.div {...fade(0.05)} className="space-y-2">
          {holdings.map((h, i) => {
            const gain = h.current - h.invested;
            const gainPct = ((gain / h.invested) * 100).toFixed(1);
            const isPositive = gain >= 0;
            return (
              <motion.div key={h.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="glass-card rounded-card p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-button flex items-center justify-center text-xs font-bold ${
                  h.type === "SIP" || h.type === "ELSS" ? "bg-accent/20 text-accent-light" :
                  h.type === "Stock" || h.type === "US Stock" ? "bg-primary/20 text-primary-light" :
                  h.type === "SGB" ? "bg-secondary/20 text-secondary-light" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {h.type.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.platform} · {h.goal}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-foreground">₹{h.current.toLocaleString("en-IN")}</p>
                  <p className={`font-mono text-xs ${isPositive ? "text-success" : "text-destructive"}`}>
                    {isPositive ? "+" : ""}₹{gain.toLocaleString("en-IN")} ({gainPct}%)
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {tab === "allocation" && (
        <motion.div {...fade(0.05)} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-card rounded-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Current Allocation</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocation} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {allocation.map((a, i) => <Cell key={i} fill={a.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(220, 47%, 11%)", border: "1px solid hsl(217, 19%, 27%)", borderRadius: "8px", color: "hsl(210, 20%, 98%)", fontSize: "12px" }}
                    formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {allocation.map((a) => {
              const actual = Math.round((a.value / totalPortfolio) * 100);
              const drift = actual - a.target;
              return (
                <div key={a.name} className="flex items-center gap-3 text-sm">
                  <span className="w-3 h-3 rounded-sm" style={{ background: a.color }} />
                  <span className="flex-1 text-foreground">{a.name}</span>
                  <span className="font-mono text-muted-foreground">{actual}%</span>
                  <span className={`font-mono text-xs ${drift > 5 ? "text-warning" : drift < -5 ? "text-destructive" : "text-muted-foreground"}`}>
                    (target {a.target}%)
                  </span>
                </div>
              );
            })}
          </div>
          <div className="space-y-4">
            <div className="glass-card rounded-card p-5 border border-warning/30 space-y-2">
              <h4 className="text-sm font-semibold text-warning flex items-center gap-2">⚠️ Rebalancing Needed</h4>
              <p className="text-xs text-muted-foreground">Equity is overweight at 72% (target 60%). Consider selling ₹3,00,000 equity and buying debt/gold.</p>
              <button className="w-full h-8 rounded-button bg-warning/20 text-warning text-xs font-medium hover:bg-warning/30 transition-colors">
                View Rebalance Plan
              </button>
            </div>
            <div className="glass-card rounded-card p-5 space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Step-Up SIP Impact (20yr)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted rounded-button text-center">
                  <p className="text-xs text-muted-foreground">Without Step-Up</p>
                  <p className="font-mono text-sm font-semibold text-foreground">{stepUpProjection.withoutStepUp}</p>
                </div>
                <div className="p-3 bg-accent/20 rounded-button text-center">
                  <p className="text-xs text-accent-light">With 10% Step-Up</p>
                  <p className="font-mono text-sm font-semibold text-accent-light">{stepUpProjection.withStepUp}</p>
                </div>
              </div>
              <p className="text-xs text-success text-center">2.2× more wealth with step-up! 🚀</p>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "insights" && (
        <motion.div {...fade(0.05)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card rounded-card p-5 border border-accent/30 space-y-2">
            <h4 className="text-sm font-semibold text-accent-light flex items-center gap-2">💡 Tax-Loss Harvesting Opportunity</h4>
            <p className="text-xs text-muted-foreground">Before March 31: Book ₹30,000 STCL to offset gains. Rebuy after 1 day (no wash sale rule in India).</p>
            <p className="text-xs text-foreground font-mono">Potential tax saved: <span className="text-success">₹6,000</span></p>
          </div>
          <div className="glass-card rounded-card p-5 space-y-2">
            <h4 className="text-sm font-semibold text-foreground">80C Utilization</h4>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary-light rounded-full" style={{ width: "100%" }} />
            </div>
            <p className="text-xs text-muted-foreground">₹1,50,000 / ₹1,50,000 — Fully utilized via PPF + ELSS ✅</p>
          </div>
          <div className="glass-card rounded-card p-5 space-y-2">
            <h4 className="text-sm font-semibold text-foreground">NPS Extra Deduction</h4>
            <p className="text-xs text-muted-foreground">80CCD(1B): ₹50,000 additional deduction exclusive to NPS — over and above 80C limit.</p>
            <p className="text-xs text-success font-mono">Tax saved at 30% slab: ₹15,600</p>
          </div>
          <div className="glass-card rounded-card p-5 space-y-2">
            <h4 className="text-sm font-semibold text-warning flex items-center gap-2">⚠️ Crypto Warning</h4>
            <p className="text-xs text-muted-foreground">Flat 30% tax on gains + 1% TDS. No loss offset allowed. Keep under 5% of portfolio.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Investing;
