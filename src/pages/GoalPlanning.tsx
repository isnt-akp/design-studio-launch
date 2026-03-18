import { motion } from "framer-motion";
import { Plus, Target, TrendingUp, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const goals = [
  { name: "Home Down Payment", icon: "🏠", target: 2500000, current: 800000, monthly: 63000, deadline: "Jun 2028", priority: "Critical", linked: "Hybrid MF SIP + FD + RD", onTrack: true },
  { name: "Child's Education Fund", icon: "🎓", target: 10000000, current: 180000, monthly: 15000, deadline: "2041", priority: "Critical", linked: "Flexi-cap SIP (de-risk at yr 10)", onTrack: true },
  { name: "Dream Car (BMW 3 Series)", icon: "🚗", target: 1500000, current: 720000, monthly: 60000, deadline: "Dec 2027", priority: "High", linked: "Short-term debt fund + RD", onTrack: true },
  { name: "Wedding Fund", icon: "💍", target: 800000, current: 550000, monthly: 35000, deadline: "Sep 2027", priority: "High", linked: "RD + allocated savings", onTrack: true },
  { name: "Parents' Healthcare Fund", icon: "👴", target: 3000000, current: 150000, monthly: 12000, deadline: "2038", priority: "Critical", linked: "Balanced advantage fund", onTrack: false },
  { name: "Executive MBA (ISB)", icon: "📚", target: 3500000, current: 400000, monthly: 100000, deadline: "2028", priority: "High", linked: "Short-term debt fund", onTrack: false },
  { name: "Debt-Free by 2035", icon: "🔓", target: 6230000, current: 270000, monthly: 52000, deadline: "2035", priority: "High", linked: "EMI + annual prepayments", onTrack: true },
  { name: "Charitable Giving (₹50K/yr)", icon: "❤️", target: 50000, current: 16668, monthly: 4167, deadline: "Mar 2027", priority: "Medium", linked: "Auto-transfer to giving account", onTrack: true },
  { name: "Sabbatical Fund (6 months)", icon: "✈️", target: 600000, current: 150000, monthly: 25000, deadline: "2028", priority: "Medium", linked: "Savings A/C", onTrack: true },
];

const GoalPlanning = () => {
  const onTrackCount = goals.filter(g => g.onTrack).length;
  const totalMonthly = goals.reduce((s, g) => s + g.monthly, 0);
  const criticalGoals = goals.filter(g => g.priority === "Critical");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Goal Planning</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Goal
        </button>
      </div>

      {/* Summary */}
      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Active Goals</p>
          <p className="font-mono text-lg font-semibold text-foreground">{goals.length}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">On Track</p>
          <p className="font-mono text-lg font-semibold text-success">{onTrackCount}/{goals.length}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Monthly Commitment</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{totalMonthly.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Critical Goals</p>
          <p className="font-mono text-lg font-semibold text-destructive">{criticalGoals.length}</p>
        </div>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = Math.round((g.current / g.target) * 100);
          const remaining = g.target - g.current;
          return (
            <motion.div key={g.name} {...fade(0.03 + i * 0.03)} className="glass-card rounded-card p-4 space-y-3 hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{g.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{g.linked}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    g.priority === "Critical" ? "bg-destructive/20 text-destructive" :
                    g.priority === "High" ? "bg-secondary/20 text-secondary" :
                    "bg-muted text-muted-foreground"
                  }`}>{g.priority}</span>
                  {g.onTrack
                    ? <span className="flex items-center gap-0.5 text-[10px] text-success"><CheckCircle2 size={10} /> On track</span>
                    : <span className="flex items-center gap-0.5 text-[10px] text-warning"><AlertTriangle size={10} /> Behind</span>
                  }
                </div>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${g.onTrack ? "bg-accent-light" : "bg-warning"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="font-mono">₹{g.current.toLocaleString("en-IN")} / ₹{(g.target / (g.target >= 10000000 ? 10000000 : g.target >= 100000 ? 100000 : 1)).toFixed(g.target >= 10000000 ? 0 : g.target >= 100000 ? 1 : 0)}{g.target >= 10000000 ? " Cr" : g.target >= 100000 ? "L" : ""}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {g.deadline}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Monthly: <span className="font-mono text-foreground">₹{g.monthly.toLocaleString("en-IN")}</span></span>
                <span className="font-mono text-foreground">{pct}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalPlanning;
