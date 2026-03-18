import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
