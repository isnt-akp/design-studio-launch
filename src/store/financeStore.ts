// Cross-layer reactive finance state store (Zustand)
// All amounts in INR — local-first architecture

import { create } from "zustand";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Account {
  id: string;
  name: string;
  type: "savings" | "current" | "credit_card" | "cash" | "investment";
  balance: number;
  institution: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense" | "transfer" | "refund";
  category: string;
  subCategory: string;
  amount: number; // always in INR (after forex conversion)
  originalAmount?: number;
  originalCurrency?: string;
  forexRate?: number;
  method: string;
  accountId: string; // which account to debit/credit
  toAccountId?: string; // for transfers
  date: string;
  tags: string[];
  isReimbursable?: boolean;
  isRecurring?: boolean;
  note?: string;
  goalId?: string; // link to goal (Layer 3↔9)
}

export interface Asset {
  category: string;
  label: string;
  value: number;
}

export interface Liability {
  id: string;
  category: string;
  label: string;
  value: number;
  emi?: number;
  rate?: number;
}

export interface BudgetEnvelope {
  category: string;
  cap: number;
  spent: number;
  icon: string;
  isFixed?: boolean; // auto-populated from debt EMIs
}

export interface SplitEntry {
  id: string;
  person: string;
  amount: number;
  status: "Pending" | "Partial" | "Settled";
  context: string;
  isPayable: boolean; // true = you owe them, false = they owe you
}

export interface InsurancePolicy {
  id: string;
  name: string;
  provider: string;
  icon: string;
  sumAssured: string;
  premium: number;
  renewal: string;
  taxSection: string;
  status: string;
  nominees: string;
  riders: string;
}

export interface Loan {
  id: string;
  name: string;
  lender: string;
  icon: string;
  principal: number;
  outstanding: number;
  rate: number;
  emi: number;
  tenure: string;
  taxBenefit: string;
  type: string;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  invested: number;
  current: number;
  xirr: number;
  goalId?: string; // link to goal
  platform: string;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  target: number;
  current: number;
  monthly: number;
  deadline: string;
  priority: "Critical" | "High" | "Medium";
  linkedInvestmentIds: string[];
  onTrack: boolean;
}

export interface TaxDeduction {
  section: string;
  items: string;
  amount: number;
  limit: number;
}

export interface NetWorthTrend {
  month: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

export interface IncomeStream {
  source: string;
  amount: number;
  pct: number;
}

// ─── Store Interface ───────────────────────────────────────────────────────────

interface FinanceStore {
  // Core data
  accounts: Account[];
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];
  budgetEnvelopes: BudgetEnvelope[];
  splits: SplitEntry[];
  loans: Loan[];
  creditCards: { name: string; limit: number; outstanding: number; minDue: number; dueDate: string; interest: string; cashback: number }[];
  bnpl: { platform: string; outstanding: number; due: string; autoDebit: boolean }[];
  investments: Investment[];
  goals: Goal[];
  insurancePolicies: InsurancePolicy[];
  taxDeductions: TaxDeduction[];
  incomeStreams: IncomeStream[];
  netWorthTrend: NetWorthTrend[];
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

  // Actions — cross-layer wiring
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  settleSplit: (splitId: string) => void;
  addSplit: (split: Omit<SplitEntry, "id">) => void;
  saveSplitExpense: (totalBill: number, payerAccountId: string, personTotals: { name: string; total: number }[], payerName: string, context: string) => void;
  linkInvestmentToGoal: (investmentId: string, goalId: string) => void;
  unlinkInvestmentFromGoal: (investmentId: string, goalId: string) => void;
  updateGrossSalary: (salary: number) => void;
  payInsurancePremium: (policyId: string, accountId: string) => void;
}

// ─── Initial Data (Scenario CC.1) ──────────────────────────────────────────────

const initialAccounts: Account[] = [
  { id: "acc_1", name: "HDFC Salary A/C", type: "savings", balance: 450000, institution: "HDFC Bank" },
  { id: "acc_2", name: "SBI Savings A/C", type: "savings", balance: 100000, institution: "SBI" },
  { id: "acc_3", name: "Cash", type: "cash", balance: 5000, institution: "—" },
  { id: "acc_4", name: "ICICI Amazon Pay CC", type: "credit_card", balance: -45000, institution: "ICICI Bank" },
];

const initialAssets: Asset[] = [
  { category: "Bank Accounts", label: "HDFC + SBI", value: 550000 },
  { category: "Emergency Fund", label: "Liquid MF", value: 345000 },
  { category: "Fixed Deposits", label: "FD Ladder", value: 400000 },
  { category: "Equity MFs", label: "SIPs (UTI Nifty 50 etc.)", value: 432000 },
  { category: "PPF", label: "SBI PPF", value: 480000 },
  { category: "NPS", label: "HDFC Pension Tier 1", value: 240000 },
  { category: "ELSS", label: "Mirae Asset ELSS", value: 277000 },
  { category: "Stocks", label: "HDFC Bank + AAPL", value: 136012 },
  { category: "Gold (SGB)", label: "SGB 2024-25", value: 84000 },
  { category: "Real Estate", label: "2BHK Whitefield", value: 9500000 },
  { category: "EPF", label: "Employer PF", value: 850000 },
];

const initialLiabilities: Liability[] = [
  { id: "l1", category: "Home Loan", label: "HDFC Ltd", value: 6230000, emi: 52000, rate: 8.5 },
  { id: "l2", category: "Car Loan", label: "HDFC Auto", value: 1260000, emi: 26000, rate: 8.75 },
  { id: "l3", category: "Credit Card", label: "ICICI Amazon Pay", value: 45000, rate: 42 },
  { id: "l4", category: "BNPL", label: "Simpl + LazyPay + Flipkart", value: 13500 },
];

const initialLoans: Loan[] = [
  { id: "loan_1", name: "Home Loan", lender: "HDFC Ltd", icon: "🏠", principal: 6500000, outstanding: 6230000, rate: 8.5, emi: 52000, tenure: "228 months", taxBenefit: "Sec 24 + 80C", type: "home" },
  { id: "loan_2", name: "Car Loan", lender: "HDFC Auto", icon: "🚗", principal: 1260000, outstanding: 850000, rate: 8.75, emi: 26000, tenure: "36 months", taxBenefit: "None", type: "car" },
  { id: "loan_3", name: "Education Loan", lender: "SBI", icon: "🎓", principal: 2500000, outstanding: 2250000, rate: 9.5, emi: 32000, tenure: "84 months", taxBenefit: "Sec 80E (full interest)", type: "education" },
];

const initialInvestments: Investment[] = [
  { id: "inv_1", name: "UTI Nifty 50 Index Fund", type: "SIP", invested: 360000, current: 432000, xirr: 15.8, goalId: "goal_7", platform: "Kuvera" },
  { id: "inv_2", name: "Mirae Asset ELSS Tax Saver", type: "ELSS", invested: 150000, current: 182000, xirr: 12.2, platform: "Groww" },
  { id: "inv_3", name: "HDFC Bank", type: "Stock", invested: 49500, current: 54600, xirr: 10.3, platform: "Zerodha" },
  { id: "inv_4", name: "PPF", type: "PPF", invested: 480000, current: 520000, xirr: 7.1, goalId: "goal_7", platform: "SBI" },
  { id: "inv_5", name: "SGB 2024-25", type: "SGB", invested: 71500, current: 84000, xirr: 11.5, platform: "RBI" },
  { id: "inv_6", name: "NPS Tier 1", type: "NPS", invested: 240000, current: 270000, xirr: 12.5, goalId: "goal_7", platform: "HDFC Pension" },
  { id: "inv_7", name: "Apple Inc (AAPL)", type: "US Stock", invested: 72187, current: 81412, xirr: 12.8, platform: "Vested" },
  { id: "inv_8", name: "HDFC Corporate Bond Fund", type: "Debt MF", invested: 300000, current: 328000, xirr: 6.2, platform: "Direct" },
  { id: "inv_9", name: "Flexi-cap SIP", type: "SIP", invested: 150000, current: 180000, xirr: 14.2, goalId: "goal_2", platform: "Kuvera" },
];

const initialGoals: Goal[] = [
  { id: "goal_1", name: "Home Down Payment", icon: "🏠", target: 2500000, current: 800000, monthly: 63000, deadline: "Jun 2028", priority: "Critical", linkedInvestmentIds: [], onTrack: true },
  { id: "goal_2", name: "Child's Education Fund", icon: "🎓", target: 10000000, current: 180000, monthly: 15000, deadline: "2041", priority: "Critical", linkedInvestmentIds: ["inv_9"], onTrack: true },
  { id: "goal_3", name: "Dream Car (BMW 3 Series)", icon: "🚗", target: 1500000, current: 720000, monthly: 60000, deadline: "Dec 2027", priority: "High", linkedInvestmentIds: [], onTrack: true },
  { id: "goal_4", name: "Wedding Fund", icon: "💍", target: 800000, current: 550000, monthly: 35000, deadline: "Sep 2027", priority: "High", linkedInvestmentIds: [], onTrack: true },
  { id: "goal_5", name: "Parents' Healthcare Fund", icon: "👴", target: 3000000, current: 150000, monthly: 12000, deadline: "2038", priority: "Critical", linkedInvestmentIds: [], onTrack: false },
  { id: "goal_6", name: "Executive MBA (ISB)", icon: "📚", target: 3500000, current: 400000, monthly: 100000, deadline: "2028", priority: "High", linkedInvestmentIds: [], onTrack: false },
  { id: "goal_7", name: "Debt-Free by 2035", icon: "🔓", target: 6230000, current: 270000, monthly: 52000, deadline: "2035", priority: "High", linkedInvestmentIds: ["inv_1", "inv_4", "inv_6"], onTrack: true },
  { id: "goal_8", name: "Charitable Giving (₹50K/yr)", icon: "❤️", target: 50000, current: 16668, monthly: 4167, deadline: "Mar 2027", priority: "Medium", linkedInvestmentIds: [], onTrack: true },
  { id: "goal_9", name: "Sabbatical Fund (6 months)", icon: "✈️", target: 600000, current: 150000, monthly: 25000, deadline: "2028", priority: "Medium", linkedInvestmentIds: [], onTrack: true },
];

const initialInsurance: InsurancePolicy[] = [
  { id: "ins_1", name: "Term Life Insurance", provider: "HDFC Click2Protect", icon: "🛡️", sumAssured: "₹1.5 Cr", premium: 18500, renewal: "Aug 15, 2026", taxSection: "80C", status: "active", nominees: "Spouse (P), Mother (S)", riders: "AD ₹50L + CI ₹25L" },
  { id: "ins_2", name: "Health Insurance (Self+Spouse)", provider: "Star Health", icon: "❤️", sumAssured: "₹15L", premium: 22000, renewal: "Nov 10, 2026", taxSection: "80D", status: "active", nominees: "Self + Spouse", riders: "No co-pay, 50% NCB" },
  { id: "ins_3", name: "Health Insurance (Parents)", provider: "Care Health", icon: "👴", sumAssured: "₹10L", premium: 38000, renewal: "Dec 05, 2026", taxSection: "80D", status: "active", nominees: "Father + Mother", riders: "Senior citizen plan" },
  { id: "ins_4", name: "Super Top-Up", provider: "HDFC Ergo", icon: "⬆️", sumAssured: "₹50L", premium: 6500, renewal: "Nov 10, 2026", taxSection: "80D", status: "active", nominees: "Self + Spouse", riders: "Deductible ₹15L" },
  { id: "ins_5", name: "Motor Insurance", provider: "ICICI Lombard", icon: "🚗", sumAssured: "IDV ₹12L", premium: 18000, renewal: "Jul 20, 2026", taxSection: "—", status: "active", nominees: "—", riders: "Zero dep + RSA" },
  { id: "ins_6", name: "Personal Accident", provider: "TATA AIG", icon: "⚡", sumAssured: "₹50L", premium: 3500, renewal: "Sep 01, 2026", taxSection: "80D", status: "active", nominees: "Spouse", riders: "Disability + Weekly benefit" },
  { id: "ins_7", name: "Home Insurance", provider: "ICICI Lombard", icon: "🏠", sumAssured: "Structure ₹85L + Contents ₹10L", premium: 8500, renewal: "Jan 15, 2027", taxSection: "—", status: "active", nominees: "—", riders: "Fire, quake, flood, theft" },
];

const initialTaxDeductions: TaxDeduction[] = [
  { section: "80C", items: "PPF + ELSS + EPF + Life Insurance", amount: 150000, limit: 150000 },
  { section: "80D", items: "Self ₹25K + Parents ₹50K", amount: 66500, limit: 75000 },
  { section: "80CCD(1B)", items: "NPS Additional", amount: 50000, limit: 50000 },
  { section: "Sec 24b", items: "Home Loan Interest", amount: 200000, limit: 200000 },
  { section: "HRA", items: "Rent Exemption", amount: 240000, limit: 240000 },
  { section: "Std Deduction", items: "Standard", amount: 75000, limit: 75000 },
];

const totalEmiAmount = initialLoans.reduce((s, l) => s + l.emi, 0);

const initialBudgetEnvelopes: BudgetEnvelope[] = [
  { category: "Food & Dining", cap: 8000, spent: 5200, icon: "🍕" },
  { category: "Transport", cap: 4000, spent: 3800, icon: "🚗" },
  { category: "Shopping", cap: 5000, spent: 1200, icon: "🛍️" },
  { category: "Entertainment", cap: 3000, spent: 3100, icon: "🎬" },
  { category: "Bills & Utilities", cap: 6000, spent: 4200, icon: "📱" },
  { category: "Grocery", cap: 6000, spent: 2340, icon: "🛒" },
  { category: "Fixed EMIs", cap: totalEmiAmount, spent: totalEmiAmount, icon: "🏦", isFixed: true },
];

const initialTransactions: Transaction[] = [
  { id: "tx_1", type: "expense", category: "Transport", subCategory: "Uber", amount: 250, method: "UPI", accountId: "acc_1", date: "Mar 17", tags: ["commute"] },
  { id: "tx_2", type: "expense", category: "Grocery", subCategory: "D-Mart", amount: 2340, method: "Credit Card", accountId: "acc_4", date: "Mar 16", tags: ["essentials"] },
  { id: "tx_3", type: "income", category: "Salary", subCategory: "March 2026", amount: 150000, method: "Bank Transfer", accountId: "acc_1", date: "Mar 1", tags: ["primary"] },
  { id: "tx_4", type: "expense", category: "Food", subCategory: "Swiggy", amount: 680, method: "UPI", accountId: "acc_1", date: "Mar 15", tags: ["food"] },
  { id: "tx_5", type: "expense", category: "Bills", subCategory: "Netflix", amount: 649, method: "Auto-debit", accountId: "acc_1", date: "Mar 5", tags: ["recurring"] },
  { id: "tx_6", type: "refund", category: "Shopping", subCategory: "Amazon Return", amount: 2500, method: "Credit Card", accountId: "acc_4", date: "Mar 12", tags: [] },
  { id: "tx_7", type: "expense", category: "Transport", subCategory: "Auto/Rickshaw", amount: 80, method: "Cash", accountId: "acc_3", date: "Mar 17", tags: ["commute", "cash"] },
  { id: "tx_8", type: "income", category: "Rental", subCategory: "2BHK Whitefield", amount: 28000, method: "Bank Transfer", accountId: "acc_1", date: "Mar 5", tags: ["passive"] },
  { id: "tx_9", type: "income", category: "Freelance", subCategory: "ABC Corp", amount: 67500, method: "Bank Transfer", accountId: "acc_1", date: "Mar 10", tags: ["freelance"] },
  { id: "tx_10", type: "expense", category: "Bills", subCategory: "Home Loan EMI", amount: 52000, method: "Auto-debit", accountId: "acc_1", date: "Mar 5", tags: ["fixed", "debt"] },
  { id: "tx_11", type: "expense", category: "Bills", subCategory: "Car Loan EMI", amount: 26000, method: "Auto-debit", accountId: "acc_1", date: "Mar 5", tags: ["fixed", "debt"] },
  { id: "tx_12", type: "expense", category: "Insurance", subCategory: "Health Premium", amount: 1833, method: "Auto-debit", accountId: "acc_1", date: "Mar 10", tags: ["80D"] },
];

const initialSplits: SplitEntry[] = [
  { id: "sp_1", person: "Rahul", amount: 1037.50, status: "Pending", context: "Dinner at Third Wave", isPayable: false },
  { id: "sp_2", person: "Priya", amount: 1287.50, status: "Pending", context: "Dinner at Third Wave", isPayable: false },
  { id: "sp_3", person: "Karan", amount: 1087.50, status: "Partial", context: "Dinner at Third Wave", isPayable: false },
  { id: "sp_4", person: "Ankit", amount: 580, status: "Pending", context: "Coffee at Third Wave", isPayable: true },
];

const initialIncomeStreams: IncomeStream[] = [
  { source: "Salary (Net)", amount: 104800, pct: 0 },
  { source: "Rental Income", amount: 28000, pct: 0 },
  { source: "Freelance", amount: 75000, pct: 0 },
  { source: "Dividends + Interest", amount: 4449, pct: 0 },
];

// Compute percentages
const totalIncomeCalc = initialIncomeStreams.reduce((s, i) => s + i.amount, 0);
initialIncomeStreams.forEach(i => { i.pct = Math.round((i.amount / totalIncomeCalc) * 100); });

const computeAssetsTotal = (assets: Asset[], receivables: number) => assets.reduce((s, a) => s + a.value, 0) + receivables;
const computeLiabilitiesTotal = (liabilities: Liability[]) => liabilities.reduce((s, l) => s + l.value, 0);

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  accounts: initialAccounts,
  transactions: initialTransactions,
  assets: initialAssets,
  liabilities: initialLiabilities,
  budgetEnvelopes: initialBudgetEnvelopes,
  splits: initialSplits,
  loans: initialLoans,
  creditCards: [
    { name: "ICICI Amazon Pay CC", limit: 300000, outstanding: 45000, minDue: 2250, dueDate: "Mar 25", interest: "42% p.a.", cashback: 2250 },
  ],
  bnpl: [
    { platform: "Simpl", outstanding: 3200, due: "Mar 16", autoDebit: true },
    { platform: "LazyPay", outstanding: 1800, due: "Mar 20", autoDebit: false },
    { platform: "Flipkart Pay Later", outstanding: 8500, due: "EMI ₹2,850/mo", autoDebit: true },
  ],
  investments: initialInvestments,
  goals: initialGoals,
  insurancePolicies: initialInsurance,
  taxDeductions: initialTaxDeductions,
  incomeStreams: initialIncomeStreams,
  grossSalary: 1800000,
  monthlyExpenses: 95000,
  netWorthTrend: [
    { month: "Oct", assets: 11800000, liabilities: 7800000, netWorth: 4000000 },
    { month: "Nov", assets: 12100000, liabilities: 7750000, netWorth: 4350000 },
    { month: "Dec", assets: 12400000, liabilities: 7700000, netWorth: 4700000 },
    { month: "Jan", assets: 12700000, liabilities: 7650000, netWorth: 4820000 },
    { month: "Feb", assets: 12900000, liabilities: 7600000, netWorth: 5210000 },
    { month: "Mar", assets: 0, liabilities: 0, netWorth: 0 }, // placeholder, computed
  ],

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

  // ─── Actions ───────────────────────────────────────────────────────────────

  addTransaction: (txData) => set((state) => {
    const tx: Transaction = { ...txData, id: `tx_${Date.now()}` };
    const newAccounts = state.accounts.map(acc => {
      if (acc.id === tx.accountId) {
        if (tx.type === "income" || tx.type === "refund") {
          return { ...acc, balance: acc.balance + tx.amount };
        } else if (tx.type === "expense") {
          return { ...acc, balance: acc.balance - tx.amount };
        } else if (tx.type === "transfer") {
          return { ...acc, balance: acc.balance - tx.amount };
        }
      }
      if (tx.type === "transfer" && tx.toAccountId && acc.id === tx.toAccountId) {
        return { ...acc, balance: acc.balance + tx.amount };
      }
      return acc;
    });

    // Update budget envelope spent
    const newEnvelopes = state.budgetEnvelopes.map(env => {
      if (tx.type === "expense" && env.category.toLowerCase().includes(tx.category.toLowerCase())) {
        return { ...env, spent: env.spent + tx.amount };
      }
      return env;
    });

    // If income (salary), update gross salary in tax engine
    let newGrossSalary = state.grossSalary;
    if (tx.type === "income" && tx.category === "Salary") {
      newGrossSalary = tx.amount * 12;
    }

    // If linked to a goal, increment goal progress
    const newGoals = tx.goalId
      ? state.goals.map(g => g.id === tx.goalId ? { ...g, current: g.current + tx.amount } : g)
      : state.goals;

    // Update asset value for bank accounts
    const bankTotal = newAccounts.filter(a => a.type === "savings" || a.type === "current").reduce((s, a) => s + a.balance, 0);
    const newAssets = state.assets.map(a => a.category === "Bank Accounts" ? { ...a, value: bankTotal } : a);

    // Update liabilities for credit cards
    const ccTotal = Math.abs(newAccounts.filter(a => a.type === "credit_card").reduce((s, a) => s + a.balance, 0));
    const newLiabilities = state.liabilities.map(l => l.category === "Credit Card" ? { ...l, value: ccTotal } : l);

    return {
      transactions: [tx, ...state.transactions],
      accounts: newAccounts,
      budgetEnvelopes: newEnvelopes,
      grossSalary: newGrossSalary,
      goals: newGoals,
      assets: newAssets,
      liabilities: newLiabilities,
    };
  }),

  settleSplit: (splitId) => set((state) => ({
    splits: state.splits.map(s => s.id === splitId ? { ...s, status: "Settled" as const } : s),
  })),

  addSplit: (splitData) => set((state) => ({
    splits: [...state.splits, { ...splitData, id: `sp_${Date.now()}` }],
  })),

  saveSplitExpense: (totalBill, payerAccountId, personTotals, payerName, context) => set((state) => {
    // 1. Debit payer account
    const newAccounts = state.accounts.map(acc =>
      acc.id === payerAccountId ? { ...acc, balance: acc.balance - totalBill } : acc
    );

    // 2. Create receivable splits (IOUs) for non-payer people
    const newSplits = personTotals
      .filter(p => p.name !== payerName)
      .map(p => ({
        id: `sp_${Date.now()}_${p.name}`,
        person: p.name,
        amount: p.total,
        status: "Pending" as const,
        context,
        isPayable: false,
      }));

    // 3. Find payer's share for expense recording
    const payerShare = personTotals.find(p => p.name === payerName)?.total || 0;

    // Update bank accounts asset
    const bankTotal = newAccounts.filter(a => a.type === "savings" || a.type === "current").reduce((s, a) => s + a.balance, 0);
    const newAssets = state.assets.map(a => a.category === "Bank Accounts" ? { ...a, value: bankTotal } : a);

    // Add expense transaction for payer's share only
    const tx: Transaction = {
      id: `tx_split_${Date.now()}`,
      type: "expense",
      category: "Food",
      subCategory: context,
      amount: payerShare,
      method: "Split",
      accountId: payerAccountId,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      tags: ["split"],
    };

    return {
      accounts: newAccounts,
      splits: [...state.splits, ...newSplits],
      assets: newAssets,
      transactions: [tx, ...state.transactions],
    };
  }),

  linkInvestmentToGoal: (investmentId, goalId) => set((state) => {
    const inv = state.investments.find(i => i.id === investmentId);
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
    return { investments: newInvestments, goals: newGoals };
  }),

  unlinkInvestmentFromGoal: (investmentId, goalId) => set((state) => {
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
    return { investments: newInvestments, goals: newGoals };
  }),

  updateGrossSalary: (salary) => set({ grossSalary: salary }),

  // Insurance → Tax wiring (Layer 6 → Layer 5)
  payInsurancePremium: (policyId, accountId) => set((state) => {
    const policy = state.insurancePolicies.find(p => p.id === policyId);
    if (!policy) return {};

    const monthlyPremium = Math.round(policy.premium / 12);

    // Debit account
    const newAccounts = state.accounts.map(acc =>
      acc.id === accountId ? { ...acc, balance: acc.balance - monthlyPremium } : acc
    );

    // Auto-update tax deductions if 80D or 80C
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

    return {
      accounts: newAccounts,
      taxDeductions: newDeductions,
      assets: newAssets,
    };
  }),
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
