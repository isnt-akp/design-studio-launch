// Cross-layer finance state store
// All amounts in INR

export interface Account {
  id: string;
  name: string;
  type: "savings" | "current" | "credit_card" | "cash" | "investment";
  balance: number;
  institution: string;
}

export interface Asset {
  category: string;
  label: string;
  value: number;
}

export interface Liability {
  category: string;
  label: string;
  value: number;
  emi?: number;
  rate?: number;
}

export interface NetWorthTrend {
  month: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

// Static data derived from scenario CC.1
export const accounts: Account[] = [
  { id: "acc_1", name: "HDFC Salary A/C", type: "savings", balance: 450000, institution: "HDFC Bank" },
  { id: "acc_2", name: "SBI Savings A/C", type: "savings", balance: 100000, institution: "SBI" },
  { id: "acc_3", name: "Cash", type: "cash", balance: 5000, institution: "—" },
  { id: "acc_4", name: "ICICI Amazon Pay CC", type: "credit_card", balance: -45000, institution: "ICICI Bank" },
];

export const assets: Asset[] = [
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

export const liabilities: Liability[] = [
  { category: "Home Loan", label: "HDFC Ltd", value: 6230000, emi: 52000, rate: 8.5 },
  { category: "Car Loan", label: "HDFC Auto", value: 1260000, emi: 26000, rate: 8.75 },
  { category: "Credit Card", label: "ICICI Amazon Pay", value: 45000, rate: 42 },
  { category: "BNPL", label: "Simpl + LazyPay + Flipkart", value: 13500 },
];

export const totalAssets = assets.reduce((s, a) => s + a.value, 0);
export const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0);
export const netWorth = totalAssets - totalLiabilities;

export const netWorthTrend: NetWorthTrend[] = [
  { month: "Oct", assets: 11800000, liabilities: 7800000, netWorth: 4000000 },
  { month: "Nov", assets: 12100000, liabilities: 7750000, netWorth: 4350000 },
  { month: "Dec", assets: 12400000, liabilities: 7700000, netWorth: 4700000 },
  { month: "Jan", assets: 12700000, liabilities: 7650000, netWorth: 4820000 },
  { month: "Feb", assets: 12900000, liabilities: 7600000, netWorth: 5210000 },
  { month: "Mar", assets: totalAssets, liabilities: totalLiabilities, netWorth: netWorth },
];

export const incomeStreams = [
  { source: "Salary (Net)", amount: 104800, pct: 0 },
  { source: "Rental Income", amount: 28000, pct: 0 },
  { source: "Freelance", amount: 75000, pct: 0 },
  { source: "Dividends + Interest", amount: 4449, pct: 0 },
];

// Calculate percentages
const totalIncome = incomeStreams.reduce((s, i) => s + i.amount, 0);
incomeStreams.forEach(i => { i.pct = Math.round((i.amount / totalIncome) * 100); });

export const monthlyExpenses = 95000;
export const monthlySaved = totalIncome - monthlyExpenses;
export const savingsRate = Math.round((monthlySaved / totalIncome) * 100);

// Format helpers
export function formatINR(amount: number, compact = false): string {
  if (compact) {
    if (Math.abs(amount) >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (Math.abs(amount) >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}
