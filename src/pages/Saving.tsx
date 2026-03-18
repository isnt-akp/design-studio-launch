import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, Plus, ArrowUpRight, Landmark, PiggyBank, Wallet } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const savingsRateTrend = [
  { month: "Oct", rate: 28 }, { month: "Nov", rate: 31 }, { month: "Dec", rate: 33 },
  { month: "Jan", rate: 38 }, { month: "Feb", rate: 42 }, { month: "Mar", rate: 46.6 },
];

const funds = [
  { name: "Emergency Fund", target: 600000, current: 345000, vehicle: "Liquid MF", icon: "🛡️", monthly: 25000, color: "bg-destructive/20 text-destructive" },
  { name: "Car Insurance Sinking Fund", target: 36000, current: 9000, vehicle: "RD (SBI, 6.8%)", icon: "🚗", monthly: 3000, color: "bg-secondary/20 text-secondary" },
  { name: "Goa Trip", target: 50000, current: 25000, vehicle: "Savings A/C", icon: "✈️", monthly: 12500, color: "bg-primary/20 text-primary-light" },
];

const fdLadder = [
  { name: "FD-1", amount: 100000, tenure: "3 months", rate: "5.5%", maturity: "Jun 2026" },
  { name: "FD-2", amount: 100000, tenure: "6 months", rate: "6.5%", maturity: "Sep 2026" },
  { name: "FD-3", amount: 100000, tenure: "12 months", rate: "7.1%", maturity: "Mar 2027" },
];

const Saving = () => {
  const totalSaved = funds.reduce((s, f) => s + f.current, 0);
  const totalTarget = funds.reduce((s, f) => s + f.target, 0);
  const savingsRate = 46.6;
  const idleCash = 300000;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Savings</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Summary */}
      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Saved</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{totalSaved.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Savings Rate</p>
          <p className="font-mono text-lg font-semibold text-success">{savingsRate}%</p>
          <p className="text-[10px] text-success">↑ improving (target &gt;30%)</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Idle Cash Detected</p>
          <p className="font-mono text-lg font-semibold text-warning">₹{idleCash.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-warning">Move to Liquid MF?</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">FD Ladder Total</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹3,00,000</p>
        </div>
      </motion.div>

      {/* Savings Rate Chart */}
      <motion.div {...fade(0.05)} className="glass-card rounded-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Savings Rate Trend</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={savingsRateTrend}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(218, 11%, 65%)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(220, 47%, 11%)", border: "1px solid hsl(217, 19%, 27%)", borderRadius: "8px", color: "hsl(210, 20%, 98%)", fontSize: "12px" }} />
              <Area type="monotone" dataKey="rate" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#savingsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>3-month avg: <span className="font-mono text-foreground">42.2%</span></span>
          <span>6-month avg: <span className="font-mono text-foreground">35.8%</span></span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Savings Goals */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Savings Goals</h3>
          {funds.map((f, i) => {
            const pct = Math.round((f.current / f.target) * 100);
            const remaining = f.target - f.current;
            const eta = Math.ceil(remaining / f.monthly);
            return (
              <motion.div key={f.name} {...fade(0.05 + i * 0.04)} className="glass-card rounded-card p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{f.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.vehicle} · ₹{f.monthly.toLocaleString("en-IN")}/mo</p>
                  </div>
                  <span className="font-mono text-sm text-foreground">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent-light rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-mono">₹{f.current.toLocaleString("en-IN")} / ₹{f.target.toLocaleString("en-IN")}</span>
                  <span>ETA: {eta} months</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FD Ladder */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">FD Ladder Strategy</h3>
          <motion.div {...fade(0.1)} className="glass-card rounded-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground mb-3">Split ₹3,00,000 for rolling liquidity — one FD always matures within 3 months</p>
            {fdLadder.map((fd, i) => (
              <div key={fd.name} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-button bg-primary/20 flex items-center justify-center">
                  <Landmark size={14} className="text-primary-light" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{fd.name}</p>
                  <p className="text-xs text-muted-foreground">{fd.tenure} · {fd.rate} p.a.</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-foreground">₹{fd.amount.toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-muted-foreground">Matures {fd.maturity}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Idle Cash Alert */}
          <motion.div {...fade(0.15)} className="glass-card rounded-card p-4 border border-warning/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-warning text-lg">⚡</span>
              <h4 className="text-sm font-semibold text-warning">Idle Cash Optimization</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              ₹3,00,000 sitting idle in HDFC Savings A/C at 3.5% p.a. Move to Liquid MF for ~6.5% returns.
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Extra annual earnings:</span>
              <span className="font-mono text-success font-semibold">+₹9,000/year</span>
            </div>
            <button className="w-full h-8 rounded-button bg-warning/20 text-warning text-xs font-medium hover:bg-warning/30 transition-colors">
              Optimize Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Saving;
