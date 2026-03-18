import { Home, CreditCard, Receipt, Target, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: CreditCard, label: "Wallet", path: "/wallet" },
  { icon: Receipt, label: "Spending", path: "/spending" },
  { icon: Target, label: "Goals", path: "/goals" },
  { icon: Menu, label: "More", path: "/more" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-card transition-all duration-200",
                isActive
                  ? "text-primary-light"
                  : "text-muted-foreground"
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
      </div>
    </nav>
  );
}
