import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedDatabase } from "./lib/seed";
import { useFinanceStore } from "./store/financeStore";

// Initialize IndexedDB with seed data, then hydrate Zustand from DB
async function boot() {
  await seedDatabase();
  await useFinanceStore.getState().hydrate();
  createRoot(document.getElementById("root")!).render(<App />);
}

boot();
