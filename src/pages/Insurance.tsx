import { motion } from "framer-motion";
import { Shield, AlertTriangle, Bell, MoreVertical, Plus, Heart, Car, Home, Plane, Users } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const policies = [
  { name: "Term Life Insurance", provider: "HDFC Click2Protect", icon: "🛡️", sum: "₹1.5 Cr", premium: 18500, renewal: "Aug 15, 2026", taxSection: "80C", status: "active", nominees: "Spouse (P), Mother (S)", riders: "AD ₹50L + CI ₹25L" },
  { name: "Health Insurance (Self+Spouse)", provider: "Star Health", icon: "❤️", sum: "₹15L", premium: 22000, renewal: "Nov 10, 2026", taxSection: "80D", status: "active", nominees: "Self + Spouse", riders: "No co-pay, 50% NCB" },
  { name: "Health Insurance (Parents)", provider: "Care Health", icon: "👴", sum: "₹10L", premium: 38000, renewal: "Dec 05, 2026", taxSection: "80D (Sr)", status: "active", nominees: "Father + Mother", riders: "Senior citizen plan" },
  { name: "Super Top-Up", provider: "HDFC Ergo", icon: "⬆️", sum: "₹50L", premium: 6500, renewal: "Nov 10, 2026", taxSection: "80D", status: "active", nominees: "Self + Spouse", riders: "Deductible ₹15L" },
  { name: "Motor Insurance", provider: "ICICI Lombard", icon: "🚗", sum: "IDV ₹12L", premium: 18000, renewal: "Jul 20, 2026", taxSection: "—", status: "active", nominees: "—", riders: "Zero dep + RSA" },
  { name: "Personal Accident", provider: "TATA AIG", icon: "⚡", sum: "₹50L", premium: 3500, renewal: "Sep 01, 2026", taxSection: "80D", status: "active", nominees: "Spouse", riders: "Disability + Weekly benefit" },
  { name: "Home Insurance", provider: "ICICI Lombard", icon: "🏠", sum: "Structure ₹85L + Contents ₹10L", premium: 8500, renewal: "Jan 15, 2027", taxSection: "—", status: "active", nominees: "—", riders: "Fire, quake, flood, theft" },
];

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
  const totalPremium = policies.reduce((s, p) => s + p.premium, 0);
  const total80D = policies.filter(p => p.taxSection.includes("80D")).reduce((s, p) => s + p.premium, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Insurance</h1>
        <button className="h-9 px-4 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Policy
        </button>
      </div>

      {/* Summary */}
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
          <p className="font-mono text-lg font-semibold text-accent-light">₹{total80D.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Total Health Cover</p>
          <p className="font-mono text-lg font-semibold text-success">₹65L</p>
          <p className="text-[10px] text-muted-foreground">Base ₹15L + Top-up ₹50L</p>
        </div>
      </motion.div>

      {/* Policy List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">All Policies</h3>
        {policies.map((p, i) => (
          <motion.div key={p.name} {...fade(0.05 + i * 0.03)} className="glass-card rounded-card p-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">{p.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.provider}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-foreground">{p.sum}</p>
                <p className="text-xs text-muted-foreground">₹{p.premium.toLocaleString("en-IN")}/yr</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Renewal: <span className="text-foreground">{p.renewal}</span></span>
              <span>Tax: <span className="text-accent-light">{p.taxSection}</span></span>
              <span>Nominees: <span className="text-foreground">{p.nominees}</span></span>
              {p.riders && <span>Riders: <span className="text-foreground">{p.riders}</span></span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bad Policy Alert */}
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
