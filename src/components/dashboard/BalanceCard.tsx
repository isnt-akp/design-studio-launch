import { motion } from "framer-motion";
import { Fingerprint, ArrowUpRight, RefreshCw } from "lucide-react";

const fadeIn = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

export function BalanceCard() {
  return (
    <motion.div {...fadeIn} className="glass-card rounded-card p-5 space-y-4">
      <p className="text-sm text-muted-foreground">Total Balance</p>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl lg:text-5xl text-balance-dollars">$8,890</span>
        <span className="text-2xl lg:text-3xl text-balance-cents">.00</span>
        <span className="ml-3 text-sm text-muted-foreground flex items-center gap-1">
          🇺🇸 USD
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground bg-muted rounded-button px-3 py-1.5">
          Money hold: 4,000.00
        </span>
        <button className="ml-auto w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export function CreditCardWidget() {
  return (
    <motion.div {...fadeIn} transition={{ delay: 0.05 }} className="space-y-3">
      <div className="card-purple-gradient rounded-card p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            <circle cx="350" cy="50" r="120" fill="white" fillOpacity="0.05" />
            <circle cx="320" cy="80" r="80" fill="white" fillOpacity="0.05" />
          </svg>
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm tracking-widest text-foreground">**** 9154</span>
            <span className="font-mono text-xs text-foreground/80">12/24</span>
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-red-500" />
              <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-80" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-foreground/20 overflow-hidden flex items-center justify-center text-[10px] font-semibold">EK</div>
            <span className="text-xs text-foreground/80">Eva K.</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 h-10 rounded-button bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 text-sm transition-colors">
          <Fingerprint size={16} />
        </button>
        <button className="flex-1 h-10 rounded-button bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 text-sm transition-colors">
          <ArrowUpRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
