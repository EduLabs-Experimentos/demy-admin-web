export interface Transaction {
  id: number;
  transactionType: string;
  transactionCategory: string;
  transactionMethod: string;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 'STUDENT_ENROLLMENT' | 'STUDENT_MONTHLY_FEE' | 'STUDENT_ONE_TIME_PAYMENT' | 'TEACHER_SALARY' | 'OFFICE_SUPPLIES' | 'OTHER';
export type TransactionMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CHECK';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED';

export const TRANSACTION_TYPES: TransactionType[] = ['INCOME', 'EXPENSE'];
export const TRANSACTION_CATEGORIES: TransactionCategory[] = ['STUDENT_ENROLLMENT', 'STUDENT_MONTHLY_FEE', 'STUDENT_ONE_TIME_PAYMENT', 'TEACHER_SALARY', 'OFFICE_SUPPLIES', 'OTHER'];
export const TRANSACTION_METHODS: TransactionMethod[] = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CHECK'];
export const CURRENCIES = ['PEN', 'USD'];
