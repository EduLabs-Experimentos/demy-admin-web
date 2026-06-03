import {BaseResource} from '../../shared/infrastructure/base-response';

export interface TransactionResource extends BaseResource {
  transactionType: string;
  transactionCategory: string;
  transactionMethod: string;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
}

export interface RegisterTransactionResource {
  transactionType: string;
  transactionCategory: string;
  transactionMethod: string;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
}

export interface UpdateTransactionResource {
  transactionType: string;
  transactionCategory: string;
  transactionMethod: string;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
}

export interface TransactionFilterParams {
  category?: string | null;
  method?: string | null;
  type?: string | null;
}