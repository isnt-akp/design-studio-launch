import { motion } from "framer-motion";
import { AlertTriangle, Plus } from "lucide-react";
import { useFinanceStore, formatINR } from "@/store/financeStore";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const badPolicy = {
  name: "LIC Jeevan Anand (Endowment)",
  premiumPaid: 400000,
  surrenderValue: 320000,
  maturityValue: 1200000,
  effectiveReturn: "~5%",
  recommendation: "Make paid-up + redirect ₹50K/yr to index fund SIP",
  projectedBenefit: "₹4,80,000 more over 12 years",
};

const Insurance = () => {
  const policies = useFinanceStore(s => s.insurancePolicies);
  const accounts = useFinanceStore(s => s.accounts);
  const payInsurancePremium = useFinanceStore(s => s.payInsurancePremium);
  const total80D = useFinanceStore(s => s.total80D)();

  const totalPremium = policies.reduce((s, p) => s + p.premium, 0);
  const healthPolicies80D = policies.filter(p => p.taxSection.includes("80D"));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Insurance</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Policy
        </button>
      </div>

      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Active Policies</p>
          <p className="font-mono text-lg font-semibold text-foreground">{policies.length}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Annual Premium</p>
          <p className="font-mono text-lg font-semibold text-foreground">₹{totalPremium.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">80D Deduction</p>
          <p className="font-mono text-lg font-semibold text-accent-light">{formatINR(total80D)}</p>
          <p className="text-[10px] text-muted-foreground">→ Auto-feeds Tax Engine</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Health Cover</p>
          <p className="font-mono text-lg font-semibold text-success">₹65L</p>
          <p className="text-[10px] text-muted-foreground">Base ₹15L + Top-up ₹50L</p>
        </div>
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">All Policies</h3>
        {policies.map((p, i) => (
          <motion.div key={p.id} {...fade(0.05 + i * 0.03)} className="glass-card rounded-card p-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">{p.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.provider}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-foreground">{p.sumAssured}</p>
                <p className="text-xs text-muted-foreground">₹{p.premium.toLocaleString("en-IN")}/yr</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Renewal: <span className="text-foreground">{p.renewal}</span></span>
              <span>Tax: <span className="text-accent-light">{p.taxSection}</span></span>
              <span>Nominees: <span className="text-foreground">{p.nominees}</span></span>
              {p.riders && <span>Riders: <span className="text-foreground">{p.riders}</span></span>}
            </div>
            {p.taxSection.includes("80D") && (
              <button onClick={() => payInsurancePremium(p.id, accounts[0]?.id || "")}
                className="text-[10px] px-2 py-1 rounded bg-accent/20 text-accent-light hover:bg-accent/30 transition-colors">
                Record Monthly Premium → Updates 80D in Tax Engine
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div {...fade(0.3)} className="glass-card rounded-card p-5 border border-warning/30 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-warning" />
          <h4 className="text-sm font-semibold text-warning">Review: Underperforming Policy</h4>
        </div>
        <p className="text-sm font-medium text-foreground">{badPolicy.name}</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-muted rounded-button">
            <p className="text-muted-foreground">Paid so far</p>
            <p className="font-mono text-foreground">₹{badPolicy.premiumPaid.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-2 bg-muted rounded-button">
            <p className="text-muted-foreground">Surrender Value</p>
            <p className="font-mono text-destructive">₹{badPolicy.surrenderValue.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-2 bg-muted rounded-button">
            <p className="text-muted-foreground">Effective Return</p>
            <p className="font-mono text-destructive">{badPolicy.effectiveReturn}</p>
          </div>
        </div>
        <div className="p-3 bg-accent/10 rounded-button">
          <p className="text-xs text-accent-light font-semibold">💡 Recommendation: {badPolicy.recommendation}</p>
          <p className="text-xs text-success mt-1">Projected benefit: {badPolicy.projectedBenefit}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Insurance;
