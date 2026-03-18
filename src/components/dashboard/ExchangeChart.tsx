import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useState } from "react";

const data = [
  { month: "Feb", value: 1800 },
  { month: "Mar", value: 2100 },
  { month: "Apr", value: 1950 },
  { month: "May", value: 2290 },
  { month: "Jun", value: 2050 },
  { month: "Jul", value: 2400 },
  { month: "Aug", value: 2290 },
  { month: "Sep", value: 2350 },
];

const periods = ["4 Hour", "1 Day", "1 Week", "1 Month", "1 Year"];

export function ExchangeChart() {
  const [activePeriod, setActivePeriod] = useState("1 Month");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-card p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          <span className="font-semibold text-foreground">USD = €0,88</span>
        </div>
        <div className="text-right">
          <span className="text-sm text-accent-light">+€0,90</span>
          <span className="text-xs text-accent-light ml-1">(12%)</span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(280, 60%, 55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(280, 60%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(218, 11%, 65%)", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "hsl(220, 47%, 11%)",
                border: "1px solid hsl(217, 19%, 27%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 98%)",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(280, 60%, 55%)"
              strokeWidth={2}
              fill="url(#areaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-1.5">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`px-3 py-1.5 text-xs rounded-button transition-colors ${
              activePeriod === p
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
