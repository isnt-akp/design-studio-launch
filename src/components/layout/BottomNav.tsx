import { Home, Receipt, Target, Wallet, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PiggyBank, TrendingUp, CreditCard, Calculator, Shield, Landmark, FileText, ScrollText, X } from "lucide-react";

const mainItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Receipt, label: "Budget", path: "/budgeting" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: Target, label: "Goals", path: "/goals" },
];

const moreItems = [
  { icon: PiggyBank, label: "Savings", path: "/savings" },
  { icon: TrendingUp, label: "Investments", path: "/investing" },
  { icon: CreditCard, label: "Debt", path: "/debt" },
  { icon: Calculator, label: "Tax", path: "/tax" },
  { icon: Shield, label: "Insurance", path: "/insurance" },
  { icon: Landmark, label: "Retirement", path: "/retirement" },
  { icon: FileText, label: "Estate", path: "/estate" },
  { icon: ScrollText, label: "Spending", path: "/spending" },
];

export function BottomNav() {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowMore(false)} />
          <div className="absolute bottom-16 left-0 right-0 p-4 z-10">
            <div className="glass-card rounded-card p-4 space-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">More</span>
                <button onClick={() => setShowMore(false)} className="text-muted-foreground">
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {moreItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 p-2 rounded-card transition-all",
                        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon size={18} />
                      <span className="text-[10px]">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {mainItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-card transition-all duration-200",
                  isActive ? "text-primary-light" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-card transition-all",
                  isActive && "bg-primary text-primary-foreground glow-primary"
                )}>
                  <item.icon size={20} />
                </div>
              </NavLink>
            );
          })}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-card transition-all duration-200",
              showMore ? "text-primary-light" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "w-10 h-10 flex items-center justify-center rounded-card transition-all",
              showMore && "bg-primary text-primary-foreground glow-primary"
            )}>
              <Menu size={20} />
            </div>
          </button>
        </div>
      </nav>
    </>
  );
}
