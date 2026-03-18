import { BalanceCard, CreditCardWidget } from "@/components/dashboard/BalanceCard";
import { ExchangeChart } from "@/components/dashboard/ExchangeChart";
import { BudgetCard, SavingsCard, WeeklyOverview } from "@/components/dashboard/OverviewWidgets";
import { GoalsCard, CashFlowCard, SendToCard } from "@/components/dashboard/ActionCards";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">DASHBOARD</h1>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-button bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>
          </button>
          <button className="h-9 px-4 rounded-button bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Week <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5l3 3 3-3" /></svg>
          </button>
        </div>
      </div>

      {/* Desktop: 3-column grid / Mobile: single column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Column 1 */}
        <div className="space-y-4">
          <BalanceCard />
          <CreditCardWidget />
          <GoalsCard />
          <CashFlowCard />
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <ExchangeChart />
          <WeeklyOverview />
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <BudgetCard />
          <SavingsCard />
          <SendToCard />
          {/* USD Wallet mini card */}
          <div className="glass-card rounded-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-accent/20 flex items-center justify-center text-accent-light font-bold text-sm">$</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">USD Wallet</p>
              <p className="font-mono text-sm text-foreground">$2,122.00</p>
            </div>
          </div>
          <div className="glass-card rounded-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-card bg-primary/20 flex items-center justify-center text-primary-light font-bold text-sm">€</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">EUR Wallet</p>
              <p className="font-mono text-sm text-foreground">€0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
