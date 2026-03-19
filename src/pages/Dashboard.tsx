import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, Target, Shield, CreditCard, PiggyBank, Landmark } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import {
  assets, liabilities, totalAssets, totalLiabilities, netWorth,
  netWorthTrend, incomeStreams, monthlyExpenses, monthlySaved, savingsRate, formatINR
} from "@/store/financeStore";

const fade = (d = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: d } });

const assetColors = [
  "hsl(217, 91%, 60%)", "hsl(160, 84%, 39%)", "hsl(38, 96%, 44%)",
  "hsl(280, 60%, 55%)", "hsl(0, 84%, 60%)", "hsl(200, 80%, 50%)",
  "hsl(320, 60%, 50%)", "hsl(140, 60%, 40%)", "hsl(50, 90%, 50%)",
  "hsl(180, 50%, 45%)", "hsl(30, 70%, 50%)",
];

const chartTooltipStyle = {
  background: "hsl(220, 47%, 11%)",
  border: "1px solid hsl(217, 19%, 27%)",
  borderRadius: "8px",
  color: "hsl(210, 20%, 98%)",
  fontSize: "12px",
};

const Dashboard = () => {
  const prevNetWorth = netWorthTrend[netWorthTrend.length - 2]?.netWorth || netWorth;
  const monthlyChange = netWorth - prevNetWorth;
  const monthlyChangePct = ((monthlyChange / prevNetWorth) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Net Worth Dashboard</h1>
        <span className="text-sm text-muted-foreground">As of Mar 2026</span>
      </div>

      {/* Hero: Net Worth */}
      <motion.div {...fade()} className="glass-card rounded-card p-6 space-y-2">
        <p className="text-sm text-muted-foreground">Total Net Worth</p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight font-mono">
            {formatINR(netWorth, true)}
          </span>
          <span className={`flex items-center gap-1 text-sm font-mono ${monthlyChange >= 0 ? "text-success" : "text-destructive"}`}>
            {monthlyChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {monthlyChange >= 0 ? "+" : ""}{formatINR(monthlyChange, true)} ({monthlyChangePct}%) this month
          </span>
        </div>
        <div className="flex gap-6 pt-2 text-sm">
          <div>
            <span className="text-muted-foreground">Assets: </span>
            <span className="font-mono text-success">{formatINR(totalAssets, true)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Liabilities: </span>
            <span className="font-mono text-destructive">{formatINR(totalLiabilities, true)}</span>
          </div>
        </div>
      </motion.div>

      {/* Summary cards */}
      <motion.div {...fade(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Monthly Income</p>
          <p className="font-mono text-lg font-semibold text-foreground">{formatINR(incomeStreams.reduce((s, i) => s + i.amount, 0), true)}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Monthly Expenses</p>
          <p className="font-mono text-lg font-semibold text-foreground">{formatINR(monthlyExpenses, true)}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Monthly Saved</p>
          <p className="font-mono text-lg font-semibold text-success">{formatINR(monthlySaved, true)}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Savings Rate</p>
          <p className="font-mono text-lg font-semibold text-success">{savingsRate}%</p>
          <p className="text-[10px] text-success">Target &gt;30% ✅</p>
        </div>
      </motion.div>

      {/* Net Worth Trend Chart */}
      <motion.div {...fade(0.1)} className="glass-card rounded-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Net Worth Trend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netWorthTrend}>
              <defs>
                <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(218, 11%, 65%)", fontSize: 11 }} />
              <YAxis hide />
              <Tooltip contentStyle={chartTooltipStyle}
                formatter={(value: number) => formatINR(value, true)} />
              <Area type="monotone" dataKey="netWorth" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#nwGrad)" name="Net Worth" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <span>3-month growth: <span className="font-mono text-success">+{formatINR(netWorth - netWorthTrend[2].netWorth, true)}</span></span>
          <span>Avg monthly: <span className="font-mono text-foreground">+{formatINR(Math.round((netWorth - netWorthTrend[0].netWorth) / 6), true)}</span></span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Assets Breakdown */}
        <motion.div {...fade(0.15)} className="glass-card rounded-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp size={14} className="text-success" /> Assets Breakdown
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assets} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {assets.map((_, i) => <Cell key={i} fill={assetColors[i % assetColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => formatINR(v, true)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {assets.map((a, i) => (
              <div key={a.category} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: assetColors[i % assetColors.length] }} />
                <span className="flex-1 text-foreground">{a.category}</span>
                <span className="font-mono text-muted-foreground">{formatINR(a.value, true)}</span>
                <span className="font-mono text-muted-foreground w-10 text-right">{Math.round((a.value / totalAssets) * 100)}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Liabilities Breakdown */}
        <motion.div {...fade(0.2)} className="space-y-4">
          <div className="glass-card rounded-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CreditCard size={14} className="text-destructive" /> Liabilities
            </h3>
            {liabilities.map((l) => (
              <div key={l.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm text-foreground">{l.category}</p>
                  <p className="text-xs text-muted-foreground">{l.label}{l.rate ? ` · ${l.rate}%` : ""}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-destructive">{formatINR(l.value, true)}</p>
                  {l.emi && <p className="text-[10px] text-muted-foreground">EMI: {formatINR(l.emi)}</p>}
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-1">
              <span className="text-sm font-medium text-foreground">Total</span>
              <span className="font-mono text-sm font-semibold text-destructive">{formatINR(totalLiabilities, true)}</span>
            </div>
          </div>

          {/* Income Streams */}
          <div className="glass-card rounded-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Income Streams</h3>
            {incomeStreams.map((inc) => (
              <div key={inc.source} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{inc.source}</span>
                    <span className="font-mono text-muted-foreground">{formatINR(inc.amount)} ({inc.pct}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent-light rounded-full" style={{ width: `${inc.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground">⚠️ Salary = 49% — Target &lt;50% for financial independence</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Layer Links */}
      <motion.div {...fade(0.25)} className="glass-card rounded-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Financial Layers Overview</h3>
        <div className="grid grid-cols-3 lg:grid-cols-9 gap-2">
          {[
            { icon: "🧾", label: "Budgeting", path: "/budgeting" },
            { icon: "💾", label: "Savings", path: "/savings" },
            { icon: "📈", label: "Investing", path: "/investing" },
            { icon: "💳", label: "Debt", path: "/debt" },
            { icon: "🧮", label: "Tax", path: "/tax" },
            { icon: "🛡️", label: "Insurance", path: "/insurance" },
            { icon: "🏖️", label: "Retirement", path: "/retirement" },
            { icon: "📜", label: "Estate", path: "/estate" },
            { icon: "🎯", label: "Goals", path: "/goals" },
          ].map((l) => (
            <a key={l.path} href={l.path} className="flex flex-col items-center gap-1.5 p-3 rounded-card hover:bg-muted/50 transition-colors">
              <span className="text-xl">{l.icon}</span>
              <span className="text-[10px] text-muted-foreground">{l.label}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
