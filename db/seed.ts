import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "@/db";
import { accounts, sessions, users, verifications } from "@/db/schema/auth";
import {
  categories,
  exchangeRates,
  financialAccounts,
  transactions,
  userSettings,
} from "@/db/schema/budget";
import { auth } from "@/lib/auth";
import { generateId } from "@/lib/nanoid";
import type { CurrencyCode } from "@/lib/types/currency";

const SEED_USER_NAME = "Ren";
const SEED_USER_EMAIL = "ren@flowbook.dev";
const SEED_USER_PASSWORD = "mbI!yDCpjYC6zydZ";
const SEED_ACCOUNTS_PER_USER_MIN = 2;
const SEED_ACCOUNTS_PER_USER_MAX = 4;
const SEED_CATEGORIES_PER_USER_MIN = 5;
const SEED_CATEGORIES_PER_USER_MAX = 10;
const SEED_TRANSACTIONS_PER_USER_MIN = 20;
const SEED_TRANSACTIONS_PER_USER_MAX = 50;
const SEED_TRANSACTION_DATE_RANGE_DAYS = 90;
const SEED_CATEGORY_ASSIGNMENT_PROBABILITY = 0.2;

const CATEGORY_NAMES = [
  "Groceries",
  "Rent",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Dining Out",
  "Healthcare",
  "Shopping",
  "Education",
  "Insurance",
  "Savings",
  "Investments",
  "Gifts",
  "Travel",
  "Subscriptions",
  "Bills",
  "Gas",
  "Coffee",
  "Fitness",
  "Home Improvement",
];

const CATEGORY_ICONS = [
  "tag",
  "shopping-cart",
  "home",
  "car",
  "heart",
  "plane",
  "book",
  "gift",
  "trending-up",
  "wallet",
  "credit-card",
  "dollar-sign",
  "star",
  "calendar",
];

const CATEGORY_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#a855f7",
  "#e11d48",
  "#0ea5e9",
  "#22c55e",
];

const TRANSACTION_DESCRIPTIONS = {
  income: [
    "Salary",
    "Freelance Payment",
    "Investment Returns",
    "Bonus",
    "Rental Income",
    "Dividend",
    "Refund",
    "Gift Received",
    "Side Hustle",
    "Commission",
  ],
  expense: [
    "Grocery Store",
    "Gas Station",
    "Restaurant",
    "Coffee Shop",
    "Pharmacy",
    "Bookstore",
    "Online Purchase",
    "Subscription",
    "Utility Bill",
    "Rent Payment",
    "Insurance Premium",
    "Gym Membership",
    "Movie Tickets",
    "Concert Tickets",
    "Clothing Store",
    "Hardware Store",
    "App Store Purchase",
    "Streaming Service",
    "Internet Bill",
    "Phone Bill",
    "Parking Fee",
    "Toll Road",
    "ATM Withdrawal",
    "Bank Fee",
    "Medical Bill",
  ],
  transfer: [
    "Transfer to Savings",
    "Transfer to Investment",
    "Account Transfer",
    "Payment to Friend",
    "Reimbursement",
    "Internal Transfer",
    "Savings Deposit",
    "Investment Deposit",
  ],
};

const ACCOUNT_NAME_PREFIXES = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Capital One",
  "American Express",
  "Personal",
  "Business",
  "Savings",
  "Emergency Fund",
  "Investment",
  "Checking",
  "Main",
  "Secondary",
];

const VENDOR_NAMES = [
  "Amazon",
  "Walmart",
  "Target",
  "Starbucks",
  "Shell",
  "Costco",
  "Apple Store",
  "Best Buy",
  "Home Depot",
  "CVS",
  "Walgreens",
  "McDonald's",
  "Whole Foods",
  "Trader Joe's",
  "Chipotle",
  "Netflix",
  "Spotify",
  "Adobe",
  "Microsoft",
  "Google",
  "Uber",
  "Lyft",
  "Airbnb",
  "Delta Airlines",
  "Hilton",
  "Marriott",
];

const SEED_VENDOR_ASSIGNMENT_PROBABILITY = 0.8;

const CURRENCY_CODES: CurrencyCode[] = [
  "AUD",
  "BGN",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR",
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length);
  const item = array[index];
  if (!item) {
    throw new Error("Cannot pick from empty array");
  }
  return item;
}

function pickRandomUnique<T>(array: T[], count: number): T[] {
  const RANDOM_SORT_CONSTANT = 0.5;
  const shuffled = [...array].sort(() => RANDOM_SORT_CONSTANT - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

async function clearTables() {
  console.log("Clearing database tables...");
  await db.delete(transactions);
  await db.delete(categories);
  await db.delete(financialAccounts);
  await db.delete(userSettings);
  await db.delete(exchangeRates);
  await db.delete(sessions);
  await db.delete(accounts);
  await db.delete(verifications);
  await db.delete(users);
  console.log("Database cleared successfully!\n");
}

async function createUser(): Promise<string> {
  console.log("Creating user...");
  const response = await auth.api.signUpEmail({
    body: {
      name: SEED_USER_NAME,
      email: SEED_USER_EMAIL,
      password: SEED_USER_PASSWORD,
    },
  });

  if (!response.user) {
    throw new Error("Failed to create user");
  }

  console.log(`✓ Created user: ${SEED_USER_NAME} (${SEED_USER_EMAIL})\n`);
  return response.user.id;
}

async function createUserSettings(userId: string) {
  console.log("Creating user settings...");
  await db.insert(userSettings).values({
    id: generateId(),
    userId,
    currency: "EUR" as CurrencyCode,
  });
  console.log("✓ Created user settings\n");
}

async function createFinancialAccounts(userId: string): Promise<string[]> {
  console.log("Creating financial accounts...");

  const accountCount = getRandomInt(
    SEED_ACCOUNTS_PER_USER_MIN,
    SEED_ACCOUNTS_PER_USER_MAX,
  );
  const accountIds: string[] = [];
  const accountsData: Array<{
    id: string;
    userId: string;
    name: string;
    type: "checking" | "savings";
    balance: string;
    currency: CurrencyCode;
  }> = [];

  for (let i = 0; i < accountCount; i++) {
    const accountId = generateId();
    accountIds.push(accountId);

    const prefix = pickRandom(ACCOUNT_NAME_PREFIXES);
    const type = pickRandom(["checking", "savings"] as const);
    const accountName =
      i === 0
        ? `${prefix} ${type.charAt(0).toUpperCase() + type.slice(1)}`
        : `${prefix} ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`;

    const balance = faker.finance.amount({
      min: 0,
      max: 10000,
      dec: 2,
    });
    const currency = pickRandom(CURRENCY_CODES) as CurrencyCode;

    accountsData.push({
      id: accountId,
      userId,
      name: accountName,
      type,
      balance,
      currency,
    });
  }

  await db.insert(financialAccounts).values(accountsData);
  console.log(`✓ Created ${accountsData.length} financial accounts\n`);
  return accountIds;
}

async function createCategories(userId: string): Promise<string[]> {
  console.log("Creating categories...");

  const categoryCount = getRandomInt(
    SEED_CATEGORIES_PER_USER_MIN,
    SEED_CATEGORIES_PER_USER_MAX,
  );
  const selectedCategories = pickRandomUnique(CATEGORY_NAMES, categoryCount);
  const categoryIds: string[] = [];
  const categoriesData: Array<{
    id: string;
    userId: string;
    name: string;
    color: string | null;
    icon: string | null;
  }> = [];

  for (const categoryName of selectedCategories) {
    const categoryId = generateId();
    categoryIds.push(categoryId);

    categoriesData.push({
      id: categoryId,
      userId,
      name: categoryName,
      color: pickRandom(CATEGORY_COLORS),
      icon: pickRandom(CATEGORY_ICONS),
    });
  }

  await db.insert(categories).values(categoriesData);
  console.log(`✓ Created ${categoriesData.length} categories\n`);
  return categoryIds;
}

async function createTransactions(
  userId: string,
  accountIds: string[],
  categoryIds: string[],
) {
  console.log("Creating transactions...");

  const transactionCount = getRandomInt(
    SEED_TRANSACTIONS_PER_USER_MIN,
    SEED_TRANSACTIONS_PER_USER_MAX,
  );
  const transactionsData: Array<{
    id: string;
    userId: string;
    accountId: string;
    categoryId: string | null;
    amount: string;
    description: string;
    vendor: string | null;
    date: Date;
    type: "income" | "expense" | "transfer";
  }> = [];

  for (let i = 0; i < transactionCount; i++) {
    const transactionId = generateId();
    const accountId = pickRandom(accountIds);

    const type = pickRandom(["income", "expense", "transfer"] as const);
    const description = pickRandom(TRANSACTION_DESCRIPTIONS[type]);

    let amount: string;
    let categoryId: string | null = null;
    let vendor: string | null = null;

    if (Math.random() > SEED_VENDOR_ASSIGNMENT_PROBABILITY) {
      vendor = pickRandom(VENDOR_NAMES);
    }

    if (type === "income") {
      amount = faker.finance.amount({
        min: 1000,
        max: 5000,
        dec: 2,
      });
    } else if (type === "expense") {
      amount = faker.finance.amount({
        min: 10,
        max: 500,
        dec: 2,
      });
      if (
        categoryIds.length > 0 &&
        Math.random() > SEED_CATEGORY_ASSIGNMENT_PROBABILITY
      ) {
        categoryId = pickRandom(categoryIds);
      }
    } else {
      amount = faker.finance.amount({
        min: 50,
        max: 1000,
        dec: 2,
      });
    }

    const date = faker.date.recent({
      days: SEED_TRANSACTION_DATE_RANGE_DAYS,
    });

    transactionsData.push({
      id: transactionId,
      userId,
      accountId,
      categoryId,
      amount,
      description,
      vendor,
      date,
      type,
    });
  }

  await db.insert(transactions).values(transactionsData);
  console.log(`✓ Created ${transactionsData.length} transactions\n`);
}

async function seed() {
  console.log("Starting database seed...\n");

  try {
    await clearTables();

    const userId = await createUser();

    await createUserSettings(userId);

    const accountIds = await createFinancialAccounts(userId);

    const categoryIds = await createCategories(userId);

    await createTransactions(userId, accountIds, categoryIds);

    console.log("Database seed completed successfully!");
    console.log(`\nUser: ${SEED_USER_NAME}`);
    console.log(`Email: ${SEED_USER_EMAIL}`);
    console.log(`Password: ${SEED_USER_PASSWORD}\n`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
