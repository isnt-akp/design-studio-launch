// Local-first IndexedDB database using Dexie.js
// All financial data persists in the browser across refreshes (TRD Section 2)

import Dexie, { type Table } from "dexie";

export interface DBAccount {
  id: string;
  name: string;
  type: "savings" | "current" | "credit_card" | "cash" | "investment";
  balance: number;
  institution: string;
}

export interface DBTransaction {
  id: string;
  type: "income" | "expense" | "transfer" | "refund";
  category: string;
  subCategory: string;
  amount: number;
  originalAmount?: number;
  originalCurrency?: string;
  forexRate?: number;
  forexMarkup?: number;
  method: string;
  accountId: string;
  toAccountId?: string;
  date: string;
  timestamp: number;
  tags: string[];
  isReimbursable?: boolean;
  isRecurring?: boolean;
  note?: string;
  goalId?: string;
  receiptImageUrl?: string;
}

export interface DBAsset {
  id: string;
  category: string;
  label: string;
  value: number;
}

export interface DBLiability {
  id: string;
  category: string;
  label: string;
  value: number;
  emi?: number;
  rate?: number;
}

export interface DBBudgetEnvelope {
  id: string;
  category: string;
  cap: number;
  spent: number;
  icon: string;
  isFixed?: boolean;
}

export interface DBSplit {
  id: string;
  person: string;
  amount: number;
  status: "Pending" | "Partial" | "Settled";
  context: string;
  isPayable: boolean;
  timestamp: number;
}

export interface DBLoan {
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

export interface DBInvestment {
  id: string;
  name: string;
  type: string;
  invested: number;
  current: number;
  xirr: number;
  goalId?: string;
  platform: string;
  taxCategory?: "80C" | "LTCG" | "STCG" | "exempt";
}

export interface DBGoal {
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

export interface DBInsurancePolicy {
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

export interface DBTaxDeduction {
  id: string;
  section: string;
  items: string;
  amount: number;
  limit: number;
}

export interface DBNetWorthSnapshot {
  id: string;
  month: string;
  year: number;
  assets: number;
  liabilities: number;
  netWorth: number;
  timestamp: number;
}

export interface DBDigitalAsset {
  id: string;
  platform: string;
  accessMethod: string;
  lastUpdated: string;
  category: "financial" | "social" | "utility" | "crypto" | "other";
  notes?: string;
}

export interface DBCreditCard {
  id: string;
  name: string;
  limit: number;
  outstanding: number;
  minDue: number;
  dueDate: string;
  interest: string;
  cashback: number;
}

export interface DBBnpl {
  id: string;
  platform: string;
  outstanding: number;
  due: string;
  autoDebit: boolean;
}

export interface DBAppSettings {
  id: string;
  grossSalary: number;
  monthlyExpenses: number;
  masterKeyHash?: string;
  lastReviewDate?: string;
}

class ArthavaultDB extends Dexie {
  accounts!: Table<DBAccount, string>;
  transactions!: Table<DBTransaction, string>;
  assets!: Table<DBAsset, string>;
  liabilities!: Table<DBLiability, string>;
  budgetEnvelopes!: Table<DBBudgetEnvelope, string>;
  splits!: Table<DBSplit, string>;
  loans!: Table<DBLoan, string>;
  investments!: Table<DBInvestment, string>;
  goals!: Table<DBGoal, string>;
  insurancePolicies!: Table<DBInsurancePolicy, string>;
  taxDeductions!: Table<DBTaxDeduction, string>;
  netWorthSnapshots!: Table<DBNetWorthSnapshot, string>;
  digitalAssets!: Table<DBDigitalAsset, string>;
  creditCards!: Table<DBCreditCard, string>;
  bnpl!: Table<DBBnpl, string>;
  appSettings!: Table<DBAppSettings, string>;

  constructor() {
    super("ArthavaultDB");

    this.version(1).stores({
      accounts: "id, type, institution",
      transactions: "id, type, category, accountId, date, timestamp, goalId",
      assets: "id, category",
      liabilities: "id, category",
      budgetEnvelopes: "id, category",
      splits: "id, person, status, timestamp",
      loans: "id, type",
      investments: "id, type, goalId, platform",
      goals: "id, priority",
      insurancePolicies: "id, taxSection",
      taxDeductions: "id, section",
      netWorthSnapshots: "id, month, timestamp",
      digitalAssets: "id, category",
      creditCards: "id",
      bnpl: "id",
      appSettings: "id",
    });
  }
}

export const db = new ArthavaultDB();

// Generate unique IDs with high precision (avoids Date.now() collisions)
export function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
