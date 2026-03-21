// Seed data for first-time app initialization (Scenario CC.1)
import { db, generateId } from "./db";

export async function seedDatabase() {
  const existingAccounts = await db.accounts.count();
  if (existingAccounts > 0) return; // Already seeded

  // Accounts
  await db.accounts.bulkAdd([
    { id: "acc_1", name: "HDFC Salary A/C", type: "savings", balance: 450000, institution: "HDFC Bank" },
    { id: "acc_2", name: "SBI Savings A/C", type: "savings", balance: 100000, institution: "SBI" },
    { id: "acc_3", name: "Cash", type: "cash", balance: 5000, institution: "—" },
    { id: "acc_4", name: "ICICI Amazon Pay CC", type: "credit_card", balance: -45000, institution: "ICICI Bank" },
  ]);

  // Assets
  await db.assets.bulkAdd([
    { id: generateId("a"), category: "Bank Accounts", label: "HDFC + SBI", value: 550000 },
    { id: generateId("a"), category: "Emergency Fund", label: "Liquid MF", value: 345000 },
    { id: generateId("a"), category: "Fixed Deposits", label: "FD Ladder", value: 400000 },
    { id: generateId("a"), category: "Equity MFs", label: "SIPs (UTI Nifty 50 etc.)", value: 432000 },
    { id: generateId("a"), category: "PPF", label: "SBI PPF", value: 480000 },
    { id: generateId("a"), category: "NPS", label: "HDFC Pension Tier 1", value: 240000 },
    { id: generateId("a"), category: "ELSS", label: "Mirae Asset ELSS", value: 277000 },
    { id: generateId("a"), category: "Stocks", label: "HDFC Bank + AAPL", value: 136012 },
    { id: generateId("a"), category: "Gold (SGB)", label: "SGB 2024-25", value: 84000 },
    { id: generateId("a"), category: "Real Estate", label: "2BHK Whitefield", value: 9500000 },
    { id: generateId("a"), category: "EPF", label: "Employer PF", value: 850000 },
  ]);

  // Liabilities
  await db.liabilities.bulkAdd([
    { id: "l1", category: "Home Loan", label: "HDFC Ltd", value: 6230000, emi: 52000, rate: 8.5 },
    { id: "l2", category: "Car Loan", label: "HDFC Auto", value: 1260000, emi: 26000, rate: 8.75 },
    { id: "l3", category: "Credit Card", label: "ICICI Amazon Pay", value: 45000, rate: 42 },
    { id: "l4", category: "BNPL", label: "Simpl + LazyPay + Flipkart", value: 13500 },
  ]);

  // Loans
  await db.loans.bulkAdd([
    { id: "loan_1", name: "Home Loan", lender: "HDFC Ltd", icon: "🏠", principal: 6500000, outstanding: 6230000, rate: 8.5, emi: 52000, tenure: "228 months", taxBenefit: "Sec 24 + 80C", type: "home" },
    { id: "loan_2", name: "Car Loan", lender: "HDFC Auto", icon: "🚗", principal: 1260000, outstanding: 850000, rate: 8.75, emi: 26000, tenure: "36 months", taxBenefit: "None", type: "car" },
    { id: "loan_3", name: "Education Loan", lender: "SBI", icon: "🎓", principal: 2500000, outstanding: 2250000, rate: 9.5, emi: 32000, tenure: "84 months", taxBenefit: "Sec 80E (full interest)", type: "education" },
  ]);

  // Investments
  await db.investments.bulkAdd([
    { id: "inv_1", name: "UTI Nifty 50 Index Fund", type: "SIP", invested: 360000, current: 432000, xirr: 15.8, goalId: "goal_7", platform: "Kuvera" },
    { id: "inv_2", name: "Mirae Asset ELSS Tax Saver", type: "ELSS", invested: 150000, current: 182000, xirr: 12.2, platform: "Groww", taxCategory: "80C" },
    { id: "inv_3", name: "HDFC Bank", type: "Stock", invested: 49500, current: 54600, xirr: 10.3, platform: "Zerodha" },
    { id: "inv_4", name: "PPF", type: "PPF", invested: 480000, current: 520000, xirr: 7.1, goalId: "goal_7", platform: "SBI", taxCategory: "80C" },
    { id: "inv_5", name: "SGB 2024-25", type: "SGB", invested: 71500, current: 84000, xirr: 11.5, platform: "RBI" },
    { id: "inv_6", name: "NPS Tier 1", type: "NPS", invested: 240000, current: 270000, xirr: 12.5, goalId: "goal_7", platform: "HDFC Pension" },
    { id: "inv_7", name: "Apple Inc (AAPL)", type: "US Stock", invested: 72187, current: 81412, xirr: 12.8, platform: "Vested" },
    { id: "inv_8", name: "HDFC Corporate Bond Fund", type: "Debt MF", invested: 300000, current: 328000, xirr: 6.2, platform: "Direct" },
    { id: "inv_9", name: "Flexi-cap SIP", type: "SIP", invested: 150000, current: 180000, xirr: 14.2, goalId: "goal_2", platform: "Kuvera" },
  ]);

  // Goals
  await db.goals.bulkAdd([
    { id: "goal_1", name: "Home Down Payment", icon: "🏠", target: 2500000, current: 800000, monthly: 63000, deadline: "Jun 2028", priority: "Critical", linkedInvestmentIds: [], onTrack: true },
    { id: "goal_2", name: "Child's Education Fund", icon: "🎓", target: 10000000, current: 180000, monthly: 15000, deadline: "2041", priority: "Critical", linkedInvestmentIds: ["inv_9"], onTrack: true },
    { id: "goal_3", name: "Dream Car (BMW 3 Series)", icon: "🚗", target: 1500000, current: 720000, monthly: 60000, deadline: "Dec 2027", priority: "High", linkedInvestmentIds: [], onTrack: true },
    { id: "goal_4", name: "Wedding Fund", icon: "💍", target: 800000, current: 550000, monthly: 35000, deadline: "Sep 2027", priority: "High", linkedInvestmentIds: [], onTrack: true },
    { id: "goal_5", name: "Parents' Healthcare Fund", icon: "👴", target: 3000000, current: 150000, monthly: 12000, deadline: "2038", priority: "Critical", linkedInvestmentIds: [], onTrack: false },
    { id: "goal_6", name: "Executive MBA (ISB)", icon: "📚", target: 3500000, current: 400000, monthly: 100000, deadline: "2028", priority: "High", linkedInvestmentIds: [], onTrack: false },
    { id: "goal_7", name: "Debt-Free by 2035", icon: "🔓", target: 6230000, current: 270000, monthly: 52000, deadline: "2035", priority: "High", linkedInvestmentIds: ["inv_1", "inv_4", "inv_6"], onTrack: true },
    { id: "goal_8", name: "Charitable Giving (₹50K/yr)", icon: "❤️", target: 50000, current: 16668, monthly: 4167, deadline: "Mar 2027", priority: "Medium", linkedInvestmentIds: [], onTrack: true },
    { id: "goal_9", name: "Sabbatical Fund (6 months)", icon: "✈️", target: 600000, current: 150000, monthly: 25000, deadline: "2028", priority: "Medium", linkedInvestmentIds: [], onTrack: true },
  ]);

  // Insurance
  await db.insurancePolicies.bulkAdd([
    { id: "ins_1", name: "Term Life Insurance", provider: "HDFC Click2Protect", icon: "🛡️", sumAssured: "₹1.5 Cr", premium: 18500, renewal: "Aug 15, 2026", taxSection: "80C", status: "active", nominees: "Spouse (P), Mother (S)", riders: "AD ₹50L + CI ₹25L" },
    { id: "ins_2", name: "Health Insurance (Self+Spouse)", provider: "Star Health", icon: "❤️", sumAssured: "₹15L", premium: 22000, renewal: "Nov 10, 2026", taxSection: "80D", status: "active", nominees: "Self + Spouse", riders: "No co-pay, 50% NCB" },
    { id: "ins_3", name: "Health Insurance (Parents)", provider: "Care Health", icon: "👴", sumAssured: "₹10L", premium: 38000, renewal: "Dec 05, 2026", taxSection: "80D", status: "active", nominees: "Father + Mother", riders: "Senior citizen plan" },
    { id: "ins_4", name: "Super Top-Up", provider: "HDFC Ergo", icon: "⬆️", sumAssured: "₹50L", premium: 6500, renewal: "Nov 10, 2026", taxSection: "80D", status: "active", nominees: "Self + Spouse", riders: "Deductible ₹15L" },
    { id: "ins_5", name: "Motor Insurance", provider: "ICICI Lombard", icon: "🚗", sumAssured: "IDV ₹12L", premium: 18000, renewal: "Jul 20, 2026", taxSection: "—", status: "active", nominees: "—", riders: "Zero dep + RSA" },
    { id: "ins_6", name: "Personal Accident", provider: "TATA AIG", icon: "⚡", sumAssured: "₹50L", premium: 3500, renewal: "Sep 01, 2026", taxSection: "80D", status: "active", nominees: "Spouse", riders: "Disability + Weekly benefit" },
    { id: "ins_7", name: "Home Insurance", provider: "ICICI Lombard", icon: "🏠", sumAssured: "Structure ₹85L + Contents ₹10L", premium: 8500, renewal: "Jan 15, 2027", taxSection: "—", status: "active", nominees: "—", riders: "Fire, quake, flood, theft" },
  ]);

  // Tax deductions
  await db.taxDeductions.bulkAdd([
    { id: "td_1", section: "80C", items: "PPF + ELSS + EPF + Life Insurance", amount: 150000, limit: 150000 },
    { id: "td_2", section: "80D", items: "Self ₹25K + Parents ₹50K", amount: 66500, limit: 75000 },
    { id: "td_3", section: "80CCD(1B)", items: "NPS Additional", amount: 50000, limit: 50000 },
    { id: "td_4", section: "Sec 24b", items: "Home Loan Interest", amount: 200000, limit: 200000 },
    { id: "td_5", section: "HRA", items: "Rent Exemption", amount: 240000, limit: 240000 },
    { id: "td_6", section: "Std Deduction", items: "Standard", amount: 75000, limit: 75000 },
  ]);

  // Net worth snapshots (historical)
  await db.netWorthSnapshots.bulkAdd([
    { id: generateId("nw"), month: "Oct", year: 2025, assets: 11800000, liabilities: 7800000, netWorth: 4000000, timestamp: Date.now() - 150 * 86400000 },
    { id: generateId("nw"), month: "Nov", year: 2025, assets: 12100000, liabilities: 7750000, netWorth: 4350000, timestamp: Date.now() - 120 * 86400000 },
    { id: generateId("nw"), month: "Dec", year: 2025, assets: 12400000, liabilities: 7700000, netWorth: 4700000, timestamp: Date.now() - 90 * 86400000 },
    { id: generateId("nw"), month: "Jan", year: 2026, assets: 12700000, liabilities: 7650000, netWorth: 4820000, timestamp: Date.now() - 60 * 86400000 },
    { id: generateId("nw"), month: "Feb", year: 2026, assets: 12900000, liabilities: 7600000, netWorth: 5210000, timestamp: Date.now() - 30 * 86400000 },
  ]);

  // Digital assets (Estate Layer)
  await db.digitalAssets.bulkAdd([
    { id: generateId("da"), platform: "Zerodha", accessMethod: "Email + TOTP", lastUpdated: "Oct 2025", category: "financial" },
    { id: generateId("da"), platform: "Kuvera", accessMethod: "Google login", lastUpdated: "Oct 2025", category: "financial" },
    { id: generateId("da"), platform: "Google Account", accessMethod: "Password + 2FA", lastUpdated: "Oct 2025", category: "utility" },
    { id: generateId("da"), platform: "iCloud", accessMethod: "Apple ID", lastUpdated: "Oct 2025", category: "utility" },
    { id: generateId("da"), platform: "1Password", accessMethod: "Master key in bank locker", lastUpdated: "Oct 2025", category: "utility" },
  ]);

  // Credit cards
  await db.creditCards.bulkAdd([
    { id: "cc_1", name: "ICICI Amazon Pay CC", limit: 300000, outstanding: 45000, minDue: 2250, dueDate: "Mar 25", interest: "42% p.a.", cashback: 2250 },
  ]);

  // BNPL
  await db.bnpl.bulkAdd([
    { id: "bnpl_1", platform: "Simpl", outstanding: 3200, due: "Mar 16", autoDebit: true },
    { id: "bnpl_2", platform: "LazyPay", outstanding: 1800, due: "Mar 20", autoDebit: false },
    { id: "bnpl_3", platform: "Flipkart Pay Later", outstanding: 8500, due: "EMI ₹2,850/mo", autoDebit: true },
  ]);

  // Budget envelopes (dynamically computed EMIs)
  const totalEmi = 52000 + 26000 + 32000;
  await db.budgetEnvelopes.bulkAdd([
    { id: generateId("be"), category: "Food & Dining", cap: 8000, spent: 5200, icon: "🍕" },
    { id: generateId("be"), category: "Transport", cap: 4000, spent: 3800, icon: "🚗" },
    { id: generateId("be"), category: "Shopping", cap: 5000, spent: 1200, icon: "🛍️" },
    { id: generateId("be"), category: "Entertainment", cap: 3000, spent: 3100, icon: "🎬" },
    { id: generateId("be"), category: "Bills & Utilities", cap: 6000, spent: 4200, icon: "📱" },
    { id: generateId("be"), category: "Grocery", cap: 6000, spent: 2340, icon: "🛒" },
    { id: generateId("be"), category: "Fixed EMIs", cap: totalEmi, spent: totalEmi, icon: "🏦", isFixed: true },
  ]);

  // Transactions
  await db.transactions.bulkAdd([
    { id: "tx_1", type: "expense", category: "Transport", subCategory: "Uber", amount: 250, method: "UPI", accountId: "acc_1", date: "Mar 17", timestamp: Date.now() - 4 * 86400000, tags: ["commute"] },
    { id: "tx_2", type: "expense", category: "Grocery", subCategory: "D-Mart", amount: 2340, method: "Credit Card", accountId: "acc_4", date: "Mar 16", timestamp: Date.now() - 5 * 86400000, tags: ["essentials"] },
    { id: "tx_3", type: "income", category: "Salary", subCategory: "March 2026", amount: 150000, method: "Bank Transfer", accountId: "acc_1", date: "Mar 1", timestamp: Date.now() - 20 * 86400000, tags: ["primary"] },
    { id: "tx_4", type: "expense", category: "Food", subCategory: "Swiggy", amount: 680, method: "UPI", accountId: "acc_1", date: "Mar 15", timestamp: Date.now() - 6 * 86400000, tags: ["food"] },
    { id: "tx_5", type: "expense", category: "Bills", subCategory: "Netflix", amount: 649, method: "Auto-debit", accountId: "acc_1", date: "Mar 5", timestamp: Date.now() - 16 * 86400000, tags: ["recurring"] },
    { id: "tx_6", type: "refund", category: "Shopping", subCategory: "Amazon Return", amount: 2500, method: "Credit Card", accountId: "acc_4", date: "Mar 12", timestamp: Date.now() - 9 * 86400000, tags: [] },
    { id: "tx_7", type: "expense", category: "Transport", subCategory: "Auto/Rickshaw", amount: 80, method: "Cash", accountId: "acc_3", date: "Mar 17", timestamp: Date.now() - 4 * 86400000, tags: ["commute", "cash"] },
    { id: "tx_8", type: "income", category: "Rental", subCategory: "2BHK Whitefield", amount: 28000, method: "Bank Transfer", accountId: "acc_1", date: "Mar 5", timestamp: Date.now() - 16 * 86400000, tags: ["passive"] },
    { id: "tx_9", type: "income", category: "Freelance", subCategory: "ABC Corp", amount: 67500, method: "Bank Transfer", accountId: "acc_1", date: "Mar 10", timestamp: Date.now() - 11 * 86400000, tags: ["freelance"] },
    { id: "tx_10", type: "expense", category: "Bills", subCategory: "Home Loan EMI", amount: 52000, method: "Auto-debit", accountId: "acc_1", date: "Mar 5", timestamp: Date.now() - 16 * 86400000, tags: ["fixed", "debt"] },
    { id: "tx_11", type: "expense", category: "Bills", subCategory: "Car Loan EMI", amount: 26000, method: "Auto-debit", accountId: "acc_1", date: "Mar 5", timestamp: Date.now() - 16 * 86400000, tags: ["fixed", "debt"] },
    { id: "tx_12", type: "expense", category: "Insurance", subCategory: "Health Premium", amount: 1833, method: "Auto-debit", accountId: "acc_1", date: "Mar 10", timestamp: Date.now() - 11 * 86400000, tags: ["80D"] },
  ]);

  // Splits
  await db.splits.bulkAdd([
    { id: "sp_1", person: "Rahul", amount: 1037.50, status: "Pending", context: "Dinner at Third Wave", isPayable: false, timestamp: Date.now() - 2 * 86400000 },
    { id: "sp_2", person: "Priya", amount: 1287.50, status: "Pending", context: "Dinner at Third Wave", isPayable: false, timestamp: Date.now() - 2 * 86400000 },
    { id: "sp_3", person: "Karan", amount: 1087.50, status: "Partial", context: "Dinner at Third Wave", isPayable: false, timestamp: Date.now() - 2 * 86400000 },
    { id: "sp_4", person: "Ankit", amount: 580, status: "Pending", context: "Coffee at Third Wave", isPayable: true, timestamp: Date.now() - 5 * 86400000 },
  ]);

  // App settings
  await db.appSettings.put({
    id: "settings",
    grossSalary: 1800000,
    monthlyExpenses: 95000,
  });
}
