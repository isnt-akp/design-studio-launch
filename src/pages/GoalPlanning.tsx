import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, CheckCircle2, AlertTriangle, Clock, Link2, Unlink } from "lucide-react";
import { useFinanceStore, formatINR } from "@/store/financeStore";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const GoalPlanning = () => {
  const goals = useFinanceStore(s => s.goals);
  const investments = useFinanceStore(s => s.investments);
  const linkInvestmentToGoal = useFinanceStore(s => s.linkInvestmentToGoal);
  const unlinkInvestmentFromGoal = useFinanceStore(s => s.unlinkInvestmentFromGoal);
  const [linkingGoalId, setLinkingGoalId] = useState<string | null>(null);

  const onTrackCount = goals.filter(g => g.onTrack).length;
  const totalMonthly = goals.reduce((s, g) => s + g.monthly, 0);
  const criticalGoals = goals.filter(g => g.priority === "Critical");

  const unlinkedInvestments = investments.filter(inv => !inv.goalId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Goal Planning</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Goal
        </button>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {goals.map((g, i) => {
          const pct = Math.round((g.current / g.target) * 100);
          const linkedInvs = investments.filter(inv => g.linkedInvestmentIds.includes(inv.id));
          const isLinking = linkingGoalId === g.id;

          return (
            <motion.div key={g.id} {...fade(0.03 + i * 0.03)} className="glass-card rounded-card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{g.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{g.name}</p>
                  <p className="text-xs text-muted-foreground">{g.linkedInvestmentIds.length} linked investments</p>
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
                <span className="font-mono">{formatINR(g.current, true)} / {formatINR(g.target, true)}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {g.deadline}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Monthly: <span className="font-mono text-foreground">{formatINR(g.monthly)}</span></span>
                <span className="font-mono text-foreground">{pct}%</span>
              </div>

              {/* Linked investments */}
              {linkedInvs.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Linked Investments</p>
                  {linkedInvs.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{inv.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground">{formatINR(inv.current, true)}</span>
                        <button onClick={() => unlinkInvestmentFromGoal(inv.id, g.id)}
                          className="text-muted-foreground hover:text-destructive"><Unlink size={10} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Link investment button */}
              <button onClick={() => setLinkingGoalId(isLinking ? null : g.id)}
                className="text-[10px] px-2 py-1 rounded bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors flex items-center gap-1">
                <Link2 size={10} /> {isLinking ? "Cancel" : "Link Investment"}
              </button>

              {isLinking && unlinkedInvestments.length > 0 && (
                <div className="space-y-1 p-2 bg-muted/50 rounded-button">
                  {unlinkedInvestments.map(inv => (
                    <button key={inv.id} onClick={() => { linkInvestmentToGoal(inv.id, g.id); setLinkingGoalId(null); }}
                      className="w-full flex items-center justify-between text-xs p-1.5 rounded hover:bg-muted transition-colors">
                      <span className="text-foreground">{inv.name}</span>
                      <span className="font-mono text-muted-foreground">{formatINR(inv.current, true)}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalPlanning;
