import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Spending from "./pages/Spending";
import Budgeting from "./pages/Budgeting";
import Saving from "./pages/Saving";
import Investing from "./pages/Investing";
import DebtManagement from "./pages/DebtManagement";
import TaxPlanning from "./pages/TaxPlanning";
import Insurance from "./pages/Insurance";
import Retirement from "./pages/Retirement";
import EstatePlanning from "./pages/EstatePlanning";
import GoalPlanning from "./pages/GoalPlanning";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/spending" element={<Spending />} />
            <Route path="/budgeting" element={<Budgeting />} />
            <Route path="/savings" element={<Saving />} />
            <Route path="/investing" element={<Investing />} />
            <Route path="/debt" element={<DebtManagement />} />
            <Route path="/tax" element={<TaxPlanning />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/retirement" element={<Retirement />} />
            <Route path="/estate" element={<EstatePlanning />} />
            <Route path="/goals" element={<GoalPlanning />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
