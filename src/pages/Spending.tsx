import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Copy, ArrowRight, Plus, Fingerprint, ChevronUp } from "lucide-react";

const tabs = ["Referral", "Rewards", "Staking"];

const Spending = () => {
  const [activeTab, setActiveTab] = useState("Referral");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Spending & History</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Content */}
        {activeTab === "Referral" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-card p-6 text-center space-y-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-4xl">
              🎁
            </div>
            <h3 className="text-lg font-semibold text-foreground">Invite Friends</h3>
            <p className="text-sm text-muted-foreground">and get $50 every month</p>
            <p className="text-sm text-secondary font-mono">http://spd.apl/?ref=12223</p>
            <button className="mx-auto h-10 px-6 rounded-button bg-muted text-foreground flex items-center gap-2 text-sm hover:bg-border transition-colors">
              Copy <Copy size={14} />
            </button>
          </motion.div>
        )}

        {activeTab === "Rewards" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="glass-card rounded-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-card bg-secondary/20 flex items-center justify-center text-lg">🎉</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Claim your 💰 reward</p>
                <p className="text-xs text-muted-foreground">🎁 Get 100₹ for your first transfer</p>
              </div>
              <ArrowRight size={16} className="text-secondary" />
            </div>
          </motion.div>
        )}

        {activeTab === "Staking" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-card p-6 text-center space-y-3"
          >
            <p className="text-muted-foreground text-sm">Staking features coming soon</p>
          </motion.div>
        )}

        {/* Savings & History Column */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-card bg-accent/20 flex items-center justify-center text-lg">🐷</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Education Savings</p>
              <p className="font-mono text-lg font-semibold text-foreground">€2,000.00</p>
            </div>
            <div className="flex gap-1.5">
              <button className="w-8 h-8 rounded-button bg-muted flex items-center justify-center text-accent-light">
                <ArrowRight size={14} className="rotate-[-90deg]" />
              </button>
              <button className="w-8 h-8 rounded-button bg-muted flex items-center justify-center text-muted-foreground">
                <Fingerprint size={14} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-card bg-secondary/20 flex items-center justify-center text-lg">💸</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Withdrawals</p>
                  <p className="text-xs text-accent-light">23 Feb - 13 Apr</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-mono text-sm font-semibold text-foreground">€2,300.00</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>📅 April, 2025</span>
              <ChevronUp size={14} />
            </div>

            <div className="space-y-2 pl-4">
              {[
                { amount: "-€200.00", location: "Wildon's St. 13/31" },
                { amount: "-€100.00", location: "Wildon's St. 13/31" },
                { amount: "-€1,000.00", location: "Wildon's St. 13/31" },
              ].map((tx, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="font-mono text-destructive">{tx.amount}</span>
                  <span className="text-muted-foreground text-xs ml-auto">{tx.location}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-card p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-card bg-accent/20 flex items-center justify-center text-lg">💵</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Cash Savings</p>
              <p className="font-mono text-lg font-semibold text-foreground">€0.00</p>
            </div>
            <div className="flex gap-1.5">
              <button className="w-8 h-8 rounded-button bg-muted flex items-center justify-center text-accent-light">
                <ArrowRight size={14} className="rotate-[-90deg]" />
              </button>
              <button className="w-8 h-8 rounded-button bg-muted flex items-center justify-center text-muted-foreground">
                <Fingerprint size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Spending;
