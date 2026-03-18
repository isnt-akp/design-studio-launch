import { motion } from "framer-motion";
import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

const tabs = ["My Wallet", "Shared to me", "Group Wallet"];

const wallets = [
  { name: "EUR Wallet", icon: "€", amount: "€0.00", color: "bg-primary/20 text-primary-light", sparkColor: "hsl(280, 60%, 55%)" },
  { name: "USD Wallet", amount: "$2,122.00", icon: "$", color: "bg-accent/20 text-accent-light", sparkColor: "hsl(160, 84%, 39%)" },
  { name: "CAD Wallet", amount: "€1,200.00", icon: "$", color: "bg-secondary/20 text-secondary-light", sparkColor: "hsl(38, 96%, 44%)" },
];

const contacts = [
  { name: "Jozy D.", initials: "JD" },
  { name: "Mike W.", initials: "MW" },
  { name: "Ody U.", initials: "OU" },
  { name: "Ann K.", initials: "AK" },
];

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("My Wallet");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Wallet</h1>
        <button className="w-9 h-9 rounded-button bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex gap-4 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm transition-colors border-b-2 ${
              activeTab === tab
                ? "text-secondary border-secondary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          {wallets.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-card p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-card flex items-center justify-center font-bold text-sm ${w.color}`}>
                {w.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{w.name}</p>
                <p className="font-mono text-lg font-semibold text-foreground">{w.amount}</p>
              </div>
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                <path
                  d="M0 18 Q10 14 15 16 T30 10 T45 12 T60 6"
                  stroke={w.sparkColor}
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Send to</h3>
                <p className="text-xs text-muted-foreground">Last Recipients</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-accent-light border border-dashed border-border">
                  <Plus size={16} />
                </div>
                <span className="text-[10px] text-accent-light">Add</span>
              </button>
              {contacts.map((c) => (
                <button key={c.name} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                    {c.initials}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{c.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
