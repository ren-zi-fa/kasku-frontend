export interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashAccount {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  balance: string;
}

export interface TransactionCategory {
  id: number;
  name: string;
  type: string;
  description: string;
}

export interface CashTransaction {
  id: number;
  description: string;
  transaction_date: string;
  type: string;
  created_at: string;
  amount: string;
  user: User | null;
  cash_account: CashAccount | null;
  transaction_category: TransactionCategory | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    pageCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
