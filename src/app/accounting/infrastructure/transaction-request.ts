export interface RegisterTransactionRequest {
  transactionType: string;
  transactionCategory: string;
  transactionMethod: string;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
}

export interface UpdateTransactionRequest {
  transactionType: string;
  transactionCategory: string;
  transactionMethod: string;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
}

export interface TransactionFilterRequest {
  category?: string | null;
  method?: string | null;
  type?: string | null;
}