import { motion } from "framer-motion";
import { useState } from "react";
import { FileText, AlertTriangle, Shield, Users, Key, CheckCircle2, XCircle, Clock, Plus, Trash2, Edit3 } from "lucide-react";
import { useFinanceStore, formatINR } from "@/store/financeStore";

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

const physicalLockers = [
  { location: "HDFC Bank Koramangala", contents: "Property docs, Will copy, Gold", lastAccessed: "Jan 2026" },
  { location: "Home Safe", contents: "Passport, Aadhaar, PAN", lastAccessed: "Mar 2026" },
];

const EstatePlanning = () => {
  const digitalAssets = useFinanceStore(s => s.digitalAssets);
  const addDigitalAsset = useFinanceStore(s => s.addDigitalAsset);
  const deleteDigitalAsset = useFinanceStore(s => s.deleteDigitalAsset);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlatform, setNewPlatform] = useState("");
  const [newAccess, setNewAccess] = useState("");
  const [newCategory, setNewCategory] = useState<"financial" | "social" | "utility" | "crypto" | "other">("financial");

  const setCount = nominations.filter(n => n.status === "set").length;
  const missingCount = nominations.filter(n => n.status === "missing").length;

  const handleAddAsset = () => {
    if (!newPlatform.trim()) return;
    addDigitalAsset({
      platform: newPlatform,
      accessMethod: newAccess,
      lastUpdated: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      category: newCategory,
    });
    setNewPlatform("");
    setNewAccess("");
    setShowAddForm(false);
  };

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

          {/* Physical Lockers */}
          <h3 className="text-sm font-semibold text-foreground pt-2">Physical Document Lockers</h3>
          <motion.div {...fade(0.15)} className="glass-card rounded-card p-4 space-y-2">
            {physicalLockers.map((locker) => (
              <div key={locker.location} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <Key size={14} className="text-secondary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{locker.location}</p>
                  <p className="text-xs text-muted-foreground">{locker.contents}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock size={10} /> {locker.lastAccessed}
                </span>
              </div>
            ))}
          </motion.div>
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

          <div className="flex items-center justify-between pt-2">
            <h3 className="text-sm font-semibold text-foreground">Digital Asset Inventory</h3>
            <button onClick={() => setShowAddForm(!showAddForm)}
              className="h-7 px-3 rounded-button bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 hover:opacity-90 transition-opacity">
              <Plus size={12} /> Add
            </button>
          </div>

          {showAddForm && (
            <motion.div {...fade()} className="glass-card rounded-card p-4 space-y-3">
              <input value={newPlatform} onChange={e => setNewPlatform(e.target.value)} placeholder="Platform name"
                className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground outline-none placeholder:text-muted-foreground" />
              <input value={newAccess} onChange={e => setNewAccess(e.target.value)} placeholder="Access method (e.g., Email + TOTP)"
                className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground outline-none placeholder:text-muted-foreground" />
              <select value={newCategory} onChange={e => setNewCategory(e.target.value as typeof newCategory)}
                className="w-full h-9 px-3 bg-muted rounded-button text-foreground text-sm outline-none">
                <option value="financial">Financial</option>
                <option value="social">Social</option>
                <option value="utility">Utility</option>
                <option value="crypto">Crypto</option>
                <option value="other">Other</option>
              </select>
              <button onClick={handleAddAsset}
                className="w-full h-8 rounded-button bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                Save Digital Asset
              </button>
            </motion.div>
          )}

          <motion.div {...fade(0.15)} className="glass-card rounded-card p-4 space-y-1">
            <p className="text-xs text-muted-foreground mb-2">Master doc in bank locker + copy with executor</p>
            {digitalAssets.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 text-sm">
                <div>
                  <p className="text-foreground">{d.platform}</p>
                  <p className="text-xs text-muted-foreground">{d.accessMethod}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    d.category === "financial" ? "bg-primary/20 text-primary-light" :
                    d.category === "crypto" ? "bg-warning/20 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>{d.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={10} /> {d.lastUpdated}
                  </span>
                  <button onClick={() => deleteDigitalAsset(d.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={12} />
                  </button>
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
