import { Search, Bell, User } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-14 lg:h-16 sticky top-0 z-40 glass-card border-b border-border">
      <div className="flex items-center gap-3 lg:hidden">
        <User size={20} className="text-muted-foreground" />
      </div>
      <div className="hidden lg:flex items-center gap-3 flex-1">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-4 rounded-button bg-muted text-sm text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Search size={18} />
        </button>
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-light" />
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-semibold">EK</span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground leading-none">Eva K.</p>
            <p className="text-xs text-muted-foreground">#433849433</p>
          </div>
        </div>
      </div>
    </header>
  );
}
