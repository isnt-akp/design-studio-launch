import { motion } from "framer-motion";
import { FileText, AlertTriangle, Shield, Users, Key, CheckCircle2, XCircle, Clock } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } });

const nominations = [
  { account: "HDFC Bank A/C", nominee: "Spouse", status: "set" },
  { account: "Zerodha Demat", nominee: "Spouse", status: "set" },
  { account: "PPF (SBI)", nominee: "Spouse", status: "set" },
  { account: "NPS", nominee: "Spouse", status: "set" },
  { account: "HDFC Term Insurance", nominee: "Spouse (P), Mother (S)", status: "set" },
  { account: "SBI Savings A/C", nominee: "—", status: "missing" },
  { account: "Kuvera MF", nominee: "—", status: "missing" },
];

const digitalAssets = [
  { platform: "Zerodha", access: "Email + TOTP", lastUpdated: "Oct 2025" },
  { platform: "Kuvera", access: "Google login", lastUpdated: "Oct 2025" },
  { platform: "Google Account", access: "Password + 2FA", lastUpdated: "Oct 2025" },
  { platform: "iCloud", access: "Apple ID", lastUpdated: "Oct 2025" },
  { platform: "1Password", access: "Master key in bank locker", lastUpdated: "Oct 2025" },
];

const willDetails = {
  status: "Drafted (not registered)",
  executor: 'Brother "Amit"',
  lastUpdated: "Aug 2025",
  assetAllocation: [
    { asset: "Property", beneficiary: "Spouse (100%)" },
    { asset: "Investment Portfolio", beneficiary: "Spouse 70%, Children 30%" },
    { asset: "SGBs", beneficiary: "Mother (100%)" },
  ],
};

const poaDetails = {
  holder: "Spouse",
  backup: "Brother",
  type: "General PoA (financial)",
  registered: true,
  reviewDate: "2028",
};

const EstatePlanning = () => {
  const setCount = nominations.filter(n => n.status === "set").length;
  const missingCount = nominations.filter(n => n.status === "missing").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Estate Planning</h1>
        <span className="text-sm text-muted-foreground">Last reviewed: Aug 2025</span>
      </div>

      {/* Summary */}
      <motion.div {...fade()} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Will Status</p>
          <p className="text-sm font-semibold text-warning">Drafted</p>
          <p className="text-[10px] text-muted-foreground">Not yet registered</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Nominations</p>
          <p className="font-mono text-lg font-semibold text-foreground">{setCount}/{nominations.length}</p>
          {missingCount > 0 && <p className="text-[10px] text-destructive">{missingCount} missing ⚠️</p>}
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">PoA Status</p>
          <p className="text-sm font-semibold text-success">Registered ✅</p>
        </div>
        <div className="glass-card rounded-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground">Digital Inventory</p>
          <p className="font-mono text-lg font-semibold text-foreground">{digitalAssets.length} platforms</p>
          <p className="text-[10px] text-muted-foreground">Update every 6 months</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Will & Nominations */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Will & Asset Allocation</h3>
          <motion.div {...fade(0.05)} className="glass-card rounded-card p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Status: <span className="text-warning">{willDetails.status}</span></span>
              <span>Executor: <span className="text-foreground">{willDetails.executor}</span></span>
            </div>
            {willDetails.assetAllocation.map((a) => (
              <div key={a.asset} className="flex justify-between py-2 border-b border-border last:border-0 text-sm">
                <span className="text-foreground">{a.asset}</span>
                <span className="text-muted-foreground">{a.beneficiary}</span>
              </div>
            ))}
          </motion.div>

          <h3 className="text-sm font-semibold text-foreground pt-2">Nomination Audit</h3>
          <motion.div {...fade(0.1)} className="glass-card rounded-card p-4 space-y-1">
            {nominations.map((n) => (
              <div key={n.account} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                {n.status === "set"
                  ? <CheckCircle2 size={14} className="text-success shrink-0" />
                  : <XCircle size={14} className="text-destructive shrink-0" />
                }
                <span className="text-sm text-foreground flex-1">{n.account}</span>
                <span className={`text-xs ${n.status === "set" ? "text-muted-foreground" : "text-destructive font-medium"}`}>
                  {n.status === "set" ? n.nominee : "NOT SET"}
                </span>
              </div>
            ))}
          </motion.div>
          {missingCount > 0 && (
            <motion.div {...fade(0.15)} className="p-3 bg-destructive/10 rounded-card border border-destructive/30">
              <p className="text-xs text-destructive font-semibold">⚠️ Fix {missingCount} missing nominations immediately</p>
            </motion.div>
          )}
        </div>

        {/* PoA + Digital Assets */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Power of Attorney</h3>
          <motion.div {...fade(0.1)} className="glass-card rounded-card p-4 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-muted-foreground">Type:</span> <span className="text-foreground">{poaDetails.type}</span></div>
              <div><span className="text-muted-foreground">Holder:</span> <span className="text-foreground">{poaDetails.holder}</span></div>
              <div><span className="text-muted-foreground">Backup:</span> <span className="text-foreground">{poaDetails.backup}</span></div>
              <div><span className="text-muted-foreground">Next review:</span> <span className="text-foreground">{poaDetails.reviewDate}</span></div>
            </div>
            <div className="p-2 bg-muted rounded-button text-xs text-muted-foreground">
              <p>⚠️ PoA becomes INVALID on death → Will takes over</p>
              <p>Medical PoA also set with DNR preferences + organ donation consent</p>
            </div>
          </motion.div>

          <h3 className="text-sm font-semibold text-foreground pt-2">Digital Asset Inventory</h3>
          <motion.div {...fade(0.15)} className="glass-card rounded-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground mb-2">Master doc in bank locker + copy with executor</p>
            {digitalAssets.map((d) => (
              <div key={d.platform} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                <div>
                  <p className="text-foreground">{d.platform}</p>
                  <p className="text-xs text-muted-foreground">{d.access}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={10} /> {d.lastUpdated}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div {...fade(0.2)} className="glass-card rounded-card p-4 border border-info/30 space-y-2">
            <h4 className="text-sm font-semibold text-info">📋 Succession Checklist</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Documents executor needs:</p>
              <p>• Death certificate</p>
              <p>• Succession / Legal heir certificate</p>
              <p>• PAN of deceased + last ITR</p>
              <p>• DRF form for shares transmission</p>
              <p>• Property mutation docs</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EstatePlanning;
