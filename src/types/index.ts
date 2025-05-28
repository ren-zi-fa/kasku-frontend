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
  transactionDate: string;
  type: string;
  createdAt: string;
  amount: string;
  user: User | null;
  cashAccount: CashAccount | null;
  category: TransactionCategory | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
