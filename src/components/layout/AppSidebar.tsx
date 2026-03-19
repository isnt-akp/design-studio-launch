import { Home, Receipt, PiggyBank, TrendingUp, CreditCard, Calculator, Shield, Landmark, FileText, Target, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Receipt, label: "Budgeting", path: "/budgeting" },
  { icon: PiggyBank, label: "Savings", path: "/savings" },
  { icon: TrendingUp, label: "Investments", path: "/investing" },
  { icon: CreditCard, label: "Debt", path: "/debt" },
  { icon: Calculator, label: "Tax", path: "/tax" },
  { icon: Shield, label: "Insurance", path: "/insurance" },
  { icon: Landmark, label: "Retirement", path: "/retirement" },
  { icon: FileText, label: "Estate", path: "/estate" },
  { icon: Target, label: "Goals", path: "/goals" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-[72px] bg-card-surface h-screen sticky top-0 items-center py-6 gap-1 overflow-y-auto">
      <div className="mb-4 w-10 h-10 rounded-card bg-primary flex items-center justify-center shrink-0">
        <span className="text-primary-foreground font-bold text-lg">A</span>
      </div>
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-12 h-12 rounded-card transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={item.label}
            >
              <item.icon size={18} />
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
