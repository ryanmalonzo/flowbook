export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  accountName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categoryColor: string | null;
  categoryIcon: string | null;
  amount: string;
  description: string;
  vendor: string | null;
  date: Date;
  type: "income" | "expense" | "transfer";
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFilters {
  search?: string;
  accountIds?: string[];
  categoryIds?: string[];
  types?: ("income" | "expense" | "transfer")[];
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
}

export interface TransactionSort {
  field: "date" | "amount" | "description" | "type";
  direction: "asc" | "desc";
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationInfo extends PaginationParams {
  total: number;
  totalPages: number;
}

export interface GetTransactionsResult {
  transactions: Transaction[];
  pagination: PaginationInfo;
  totalUnfiltered: number;
}
