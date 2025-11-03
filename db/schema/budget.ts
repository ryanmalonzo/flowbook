import {
  decimal,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const accountTypeEnum = pgEnum("account_type", ["checking", "savings"]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
  "transfer",
]);

export const currencyEnum = pgEnum("currency", [
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
]);

export const financialAccounts = pgTable("financial_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: accountTypeEnum("type").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0"),
  currency: currencyEnum("currency").default("USD"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  currency: currencyEnum("currency").default("USD").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const exchangeRates = pgTable(
  "exchange_rates",
  {
    id: text("id").primaryKey(),
    baseCurrency: currencyEnum("base_currency").notNull(),
    targetCurrency: currencyEnum("target_currency").notNull(),
    rate: decimal("rate", { precision: 10, scale: 6 }).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => ({
    baseTargetUnique: unique().on(table.baseCurrency, table.targetCurrency),
  }),
);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color"),
  icon: text("icon"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const transactions = pgTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id")
      .notNull()
      .references(() => financialAccounts.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    description: text("description").notNull(),
    date: timestamp("date").notNull(),
    type: transactionTypeEnum("type").notNull(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => ({
    accountIdIdx: index("transactions_account_id_idx").on(table.accountId),
    userIdIdx: index("transactions_user_id_idx").on(table.userId),
    dateIdx: index("transactions_date_idx").on(table.date),
    accountDateIdx: index("transactions_account_date_idx").on(
      table.accountId,
      table.date,
    ),
  }),
);
