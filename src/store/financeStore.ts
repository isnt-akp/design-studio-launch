// Cross-layer reactive finance state store (Zustand + IndexedDB persistence)
// All amounts in INR — local-first architecture with Dexie.js backing

import { create } from "zustand";
import { db, generateId } from "@/lib/db";
import type {
  DBAccount, DBTransaction, DBAsset, DBLiability, DBBudgetEnvelope,
  DBSplit, DBLoan, DBInvestment, DBGoal, DBInsurancePolicy,
  DBTaxDeduction, DBNetWorthSnapshot, DBDigitalAsset, DBCreditCard, DBBnpl,
} from "@/lib/db";

// Re-export types for backwards compat
export type Account = DBAccount;
export type Transaction = DBTransaction;
export type Asset = DBAsset;
export type Liability = DBLiability;
export type BudgetEnvelope = DBBudgetEnvelope;
export type SplitEntry = DBSplit;
export type Loan = DBLoan;
export type Investment = DBInvestment;
export type Goal = DBGoal;
export type InsurancePolicy = DBInsurancePolicy;
export type TaxDeduction = DBTaxDeduction;
export type NetWorthTrend = DBNetWorthSnapshot;
export type DigitalAsset = DBDigitalAsset;

export interface IncomeStream {
  source: string;
  amount: number;
  pct: number;
}

// ─── Store Interface ───────────────────────────────────────────────────────────

interface FinanceStore {
  // Loading state
  isHydrated: boolean;
  hydrate: () => Promise<void>;

  // Core data
  accounts: Account[];
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];
  budgetEnvelopes: BudgetEnvelope[];
  splits: SplitEntry[];
  loans: Loan[];
  creditCards: DBCreditCard[];
  bnpl: DBBnpl[];
  investments: Investment[];
  goals: Goal[];
  insurancePolicies: InsurancePolicy[];
  taxDeductions: TaxDeduction[];
  incomeStreams: IncomeStream[];
  netWorthTrend: NetWorthTrend[];
  digitalAssets: DigitalAsset[];
  grossSalary: number;
  monthlyExpenses: number;

  // Computed getters
  totalAssets: () => number;
  totalLiabilities: () => number;
  netWorth: () => number;
  totalIncome: () => number;
  monthlySaved: () => number;
  savingsRate: () => number;
  totalReceivables: () => number;
  totalPayables: () => number;
  totalEmi: () => number;
  total80D: () => number;
  total80C: () => number;

  // Actions — cross-layer wiring with IndexedDB persistence
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void;
  settleSplit: (splitId: string) => void;
  addSplit: (split: Omit<SplitEntry, "id" | "timestamp">) => void;
  saveSplitExpense: (totalBill: number, payerAccountId: string, personTotals: { name: string; total: number }[], payerName: string, context: string) => void;
  linkInvestmentToGoal: (investmentId: string, goalId: string) => void;
  unlinkInvestmentFromGoal: (investmentId: string, goalId: string) => void;
  updateGrossSalary: (salary: number) => void;
  payInsurancePremium: (policyId: string, accountId: string) => void;
  addDigitalAsset: (asset: Omit<DigitalAsset, "id">) => void;
  updateDigitalAsset: (id: string, updates: Partial<DigitalAsset>) => void;
  deleteDigitalAsset: (id: string) => void;
}

// Compute helpers
const computeAssetsTotal = (assets: Asset[], receivables: number) => assets.reduce((s, a) => s + a.value, 0) + receivables;
const computeLiabilitiesTotal = (liabilities: Liability[]) => liabilities.reduce((s, l) => s + l.value, 0);

// Income streams derived from transactions
function computeIncomeStreams(transactions: Transaction[]): IncomeStream[] {
  const incomeBySource: Record<string, number> = {};
  const incomeTransactions = transactions.filter(t => t.type === "income");
  
  for (const tx of incomeTransactions) {
    const source = tx.category === "Salary" ? "Salary (Net)" : tx.category === "Rental" ? "Rental Income" : tx.category === "Freelance" ? "Freelance" : tx.category;
    incomeBySource[source] = (incomeBySource[source] || 0) + tx.amount;
  }
  
  // Add dividends placeholder if not present
  if (!incomeBySource["Dividends + Interest"]) {
    incomeBySource["Dividends + Interest"] = 4449;
  }

  const total = Object.values(incomeBySource).reduce((s, v) => s + v, 0);
  return Object.entries(incomeBySource).map(([source, amount]) => ({
    source,
    amount,
    pct: total > 0 ? Math.round((amount / total) * 100) : 0,
  }));
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  isHydrated: false,
  accounts: [],
  transactions: [],
  assets: [],
  liabilities: [],
  budgetEnvelopes: [],
  splits: [],
  loans: [],
  creditCards: [],
  bnpl: [],
  investments: [],
  goals: [],
  insurancePolicies: [],
  taxDeductions: [],
  incomeStreams: [],
  netWorthTrend: [],
  digitalAssets: [],
  grossSalary: 1800000,
  monthlyExpenses: 95000,

  // Hydrate from IndexedDB on app load
  hydrate: async () => {
    const [accounts, transactions, assets, liabilities, budgetEnvelopes, splits, loans, creditCards, bnpl, investments, goals, insurancePolicies, taxDeductions, netWorthTrend, digitalAssets, settings] = await Promise.all([
      db.accounts.toArray(),
      db.transactions.orderBy("timestamp").reverse().toArray(),
      db.assets.toArray(),
      db.liabilities.toArray(),
      db.budgetEnvelopes.toArray(),
      db.splits.toArray(),
      db.loans.toArray(),
      db.creditCards.toArray(),
      db.bnpl.toArray(),
      db.investments.toArray(),
      db.goals.toArray(),
      db.insurancePolicies.toArray(),
      db.taxDeductions.toArray(),
      db.netWorthSnapshots.orderBy("timestamp").toArray(),
      db.digitalAssets.toArray(),
      db.appSettings.get("settings"),
    ]);

    const incomeStreams = computeIncomeStreams(transactions);

    // Dynamically compute Fixed EMI envelope from loans
    const totalEmi = loans.reduce((s, l) => s + l.emi, 0);
    const updatedEnvelopes = budgetEnvelopes.map(env =>
      env.isFixed ? { ...env, cap: totalEmi, spent: totalEmi } : env
    );

    // Reactively compute 80C from ELSS/PPF investments
    const elssTotal = investments
      .filter(i => i.taxCategory === "80C" || i.type === "ELSS" || i.type === "PPF")
      .reduce((s, i) => s + i.invested, 0);
    const updated80C = taxDeductions.map(d =>
      d.section === "80C" ? { ...d, amount: Math.min(elssTotal + 18500, d.limit) } : d
    );

    set({
      isHydrated: true,
      accounts,
      transactions,
      assets,
      liabilities,
      budgetEnvelopes: updatedEnvelopes,
      splits,
      loans,
      creditCards,
      bnpl,
      investments,
      goals,
      insurancePolicies,
      taxDeductions: updated80C,
      incomeStreams,
      netWorthTrend,
      digitalAssets,
      grossSalary: settings?.grossSalary ?? 1800000,
      monthlyExpenses: settings?.monthlyExpenses ?? 95000,
    });
  },

  // Computed
  totalAssets: () => {
    const s = get();
    return computeAssetsTotal(s.assets, s.splits.filter(sp => !sp.isPayable && sp.status !== "Settled").reduce((sum, sp) => sum + sp.amount, 0));
  },
  totalLiabilities: () => computeLiabilitiesTotal(get().liabilities),
  netWorth: () => get().totalAssets() - get().totalLiabilities(),
  totalIncome: () => get().incomeStreams.reduce((s, i) => s + i.amount, 0),
  monthlySaved: () => get().totalIncome() - get().monthlyExpenses,
  savingsRate: () => {
    const inc = get().totalIncome();
    return inc > 0 ? Math.round((get().monthlySaved() / inc) * 100) : 0;
  },
  totalReceivables: () => get().splits.filter(s => !s.isPayable && s.status !== "Settled").reduce((sum, s) => sum + s.amount, 0),
  totalPayables: () => get().splits.filter(s => s.isPayable && s.status !== "Settled").reduce((sum, s) => sum + s.amount, 0),
  totalEmi: () => get().loans.reduce((s, l) => s + l.emi, 0),
  total80D: () => get().taxDeductions.filter(d => d.section === "80D").reduce((s, d) => s + d.amount, 0),
  total80C: () => get().taxDeductions.filter(d => d.section === "80C").reduce((s, d) => s + d.amount, 0),

  // ─── Actions with IndexedDB persistence ────────────────────────────────────

  addTransaction: (txData) => {
    const tx: Transaction = { ...txData, id: generateId("tx"), timestamp: Date.now() };
    
    set((state) => {
      const newAccounts = state.accounts.map(acc => {
        if (acc.id === tx.accountId) {
          if (tx.type === "income" || tx.type === "refund") return { ...acc, balance: acc.balance + tx.amount };
          if (tx.type === "expense") return { ...acc, balance: acc.balance - tx.amount };
          if (tx.type === "transfer") return { ...acc, balance: acc.balance - tx.amount };
        }
        // Transfer: credit destination account
        if (tx.type === "transfer" && tx.toAccountId && acc.id === tx.toAccountId) {
          // CC bill payment: reduce liability
          if (acc.type === "credit_card") {
            return { ...acc, balance: acc.balance + tx.amount }; // negative balance gets closer to 0
          }
          return { ...acc, balance: acc.balance + tx.amount };
        }
        return acc;
      });

      // Update budget envelope
      const newEnvelopes = state.budgetEnvelopes.map(env => {
        if (tx.type === "expense" && env.category.toLowerCase().includes(tx.category.toLowerCase())) {
          return { ...env, spent: env.spent + tx.amount };
        }
        return env;
      });

      // Salary → Tax engine
      let newGrossSalary = state.grossSalary;
      if (tx.type === "income" && tx.category === "Salary") {
        newGrossSalary = tx.amount * 12;
      }

      // Goal progress
      const newGoals = tx.goalId
        ? state.goals.map(g => g.id === tx.goalId ? { ...g, current: g.current + tx.amount } : g)
        : state.goals;

      // Update asset value for bank accounts
      const bankTotal = newAccounts.filter(a => a.type === "savings" || a.type === "current").reduce((s, a) => s + a.balance, 0);
      const newAssets = state.assets.map(a => a.category === "Bank Accounts" ? { ...a, value: bankTotal } : a);

      // Update liabilities for credit cards
      const ccTotal = Math.abs(newAccounts.filter(a => a.type === "credit_card").reduce((s, a) => s + a.balance, 0));
      const newLiabilities = state.liabilities.map(l => l.category === "Credit Card" ? { ...l, value: ccTotal } : l);

      // Recalculate income streams
      const allTx = [tx, ...state.transactions];
      const newIncomeStreams = computeIncomeStreams(allTx);

      // Persist to IndexedDB (fire-and-forget)
      db.transactions.add(tx);
      newAccounts.forEach(a => db.accounts.put(a));
      newEnvelopes.forEach(e => db.budgetEnvelopes.put(e));
      newGoals.forEach(g => db.goals.put(g));
      newAssets.forEach(a => db.assets.put(a));
      newLiabilities.forEach(l => db.liabilities.put(l));
      if (newGrossSalary !== state.grossSalary) {
        db.appSettings.update("settings", { grossSalary: newGrossSalary });
      }

      return {
        transactions: [tx, ...state.transactions],
        accounts: newAccounts,
        budgetEnvelopes: newEnvelopes,
        grossSalary: newGrossSalary,
        goals: newGoals,
        assets: newAssets,
        liabilities: newLiabilities,
        incomeStreams: newIncomeStreams,
      };
    });
  },

  settleSplit: (splitId) => {
    set((state) => ({
      splits: state.splits.map(s => s.id === splitId ? { ...s, status: "Settled" as const } : s),
    }));
    db.splits.update(splitId, { status: "Settled" });
  },

  addSplit: (splitData) => {
    const split: SplitEntry = { ...splitData, id: generateId("sp"), timestamp: Date.now() };
    set((state) => ({ splits: [...state.splits, split] }));
    db.splits.add(split);
  },

  saveSplitExpense: (totalBill, payerAccountId, personTotals, payerName, context) => {
    set((state) => {
      const newAccounts = state.accounts.map(acc =>
        acc.id === payerAccountId ? { ...acc, balance: acc.balance - totalBill } : acc
      );

      const newSplits: SplitEntry[] = personTotals
        .filter(p => p.name !== payerName)
        .map(p => ({
          id: generateId("sp"),
          person: p.name,
          amount: p.total,
          status: "Pending" as const,
          context,
          isPayable: false,
          timestamp: Date.now(),
        }));

      const payerShare = personTotals.find(p => p.name === payerName)?.total || 0;

      const bankTotal = newAccounts.filter(a => a.type === "savings" || a.type === "current").reduce((s, a) => s + a.balance, 0);
      const newAssets = state.assets.map(a => a.category === "Bank Accounts" ? { ...a, value: bankTotal } : a);

      const tx: Transaction = {
        id: generateId("tx"),
        type: "expense",
        category: "Food",
        subCategory: context,
        amount: payerShare,
        method: "Split",
        accountId: payerAccountId,
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        timestamp: Date.now(),
        tags: ["split"],
      };

      // Persist
      db.transactions.add(tx);
      newAccounts.forEach(a => db.accounts.put(a));
      newSplits.forEach(s => db.splits.add(s));
      newAssets.forEach(a => db.assets.put(a));

      return {
        accounts: newAccounts,
        splits: [...state.splits, ...newSplits],
        assets: newAssets,
        transactions: [tx, ...state.transactions],
      };
    });
  },

  linkInvestmentToGoal: (investmentId, goalId) => {
    set((state) => {
      const newInvestments = state.investments.map(i =>
        i.id === investmentId ? { ...i, goalId } : i
      );
      const newGoals = state.goals.map(g => {
        if (g.id === goalId && !g.linkedInvestmentIds.includes(investmentId)) {
          const linkedCurrent = newInvestments
            .filter(i => i.goalId === goalId)
            .reduce((s, i) => s + i.current, 0);
          return { ...g, linkedInvestmentIds: [...g.linkedInvestmentIds, investmentId], current: linkedCurrent };
        }
        return g;
      });

      db.investments.update(investmentId, { goalId });
      newGoals.forEach(g => db.goals.put(g));

      return { investments: newInvestments, goals: newGoals };
    });
  },

  unlinkInvestmentFromGoal: (investmentId, goalId) => {
    set((state) => {
      const newInvestments = state.investments.map(i =>
        i.id === investmentId ? { ...i, goalId: undefined } : i
      );
      const newGoals = state.goals.map(g => {
        if (g.id === goalId) {
          const newLinked = g.linkedInvestmentIds.filter(id => id !== investmentId);
          const linkedCurrent = newInvestments
            .filter(i => newLinked.includes(i.id))
            .reduce((s, i) => s + i.current, 0);
          return { ...g, linkedInvestmentIds: newLinked, current: linkedCurrent || g.current };
        }
        return g;
      });

      db.investments.update(investmentId, { goalId: undefined });
      newGoals.forEach(g => db.goals.put(g));

      return { investments: newInvestments, goals: newGoals };
    });
  },

  updateGrossSalary: (salary) => {
    set({ grossSalary: salary });
    db.appSettings.update("settings", { grossSalary: salary });
  },

  payInsurancePremium: (policyId, accountId) => {
    set((state) => {
      const policy = state.insurancePolicies.find(p => p.id === policyId);
      if (!policy) return {};

      const monthlyPremium = Math.round(policy.premium / 12);

      const newAccounts = state.accounts.map(acc =>
        acc.id === accountId ? { ...acc, balance: acc.balance - monthlyPremium } : acc
      );

      let newDeductions = state.taxDeductions;
      if (policy.taxSection.includes("80D")) {
        newDeductions = newDeductions.map(d =>
          d.section === "80D" ? { ...d, amount: Math.min(d.amount + monthlyPremium, d.limit) } : d
        );
      }
      if (policy.taxSection.includes("80C")) {
        newDeductions = newDeductions.map(d =>
          d.section === "80C" ? { ...d, amount: Math.min(d.amount + monthlyPremium, d.limit) } : d
        );
      }

      const bankTotal = newAccounts.filter(a => a.type === "savings" || a.type === "current").reduce((s, a) => s + a.balance, 0);
      const newAssets = state.assets.map(a => a.category === "Bank Accounts" ? { ...a, value: bankTotal } : a);

      // Persist
      newAccounts.forEach(a => db.accounts.put(a));
      newDeductions.forEach(d => db.taxDeductions.put(d));
      newAssets.forEach(a => db.assets.put(a));

      return { accounts: newAccounts, taxDeductions: newDeductions, assets: newAssets };
    });
  },

  addDigitalAsset: (assetData) => {
    const asset: DigitalAsset = { ...assetData, id: generateId("da") };
    set((state) => ({ digitalAssets: [...state.digitalAssets, asset] }));
    db.digitalAssets.add(asset);
  },

  updateDigitalAsset: (id, updates) => {
    set((state) => ({
      digitalAssets: state.digitalAssets.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
    db.digitalAssets.update(id, updates);
  },

  deleteDigitalAsset: (id) => {
    set((state) => ({
      digitalAssets: state.digitalAssets.filter(a => a.id !== id),
    }));
    db.digitalAssets.delete(id);
  },
}));

// ─── Format helpers ────────────────────────────────────────────────────────────

export function formatINR(amount: number, compact = false): string {
  if (compact) {
    if (Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (Math.abs(amount) >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}
