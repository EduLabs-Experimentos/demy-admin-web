import {Injectable, signal, computed} from '@angular/core';
import {Transaction, TRANSACTION_TYPES, TRANSACTION_CATEGORIES, TRANSACTION_METHODS, CURRENCIES} from '../../domain/model/transaction.entity';
import {GetTransactionsService} from '../services/get-transactions.service';
import {CreateTransactionService} from '../services/create-transaction.service';
import {UpdateTransactionService} from '../services/update-transaction.service';
import {DeleteTransactionService} from '../services/delete-transaction.service';
import {ExportTransactionsService} from '../services/export-transactions.service';
import {TransactionResource, RegisterTransactionResource, UpdateTransactionResource, TransactionFilterParams} from '../../infrastructure/transaction-response';
import {TransactionAssembler} from '../../infrastructure/transaction-assembler';

export interface TransactionFormData {
  transactionType: string;
  transactionCategory: string;
  transactionMethod: string;
  amount: string;
  currency: string;
  description: string;
  transactionDate: string;
}

@Injectable({providedIn: 'root'})
export class AccountingStore {
  private readonly transactionsSignal = signal<Transaction[]>([]);
  private readonly filteredTransactionsSignal = signal<Transaction[]>([]);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly isLoadingTransactionsSignal = signal<boolean>(false);
  private readonly isDeletingSignal = signal<boolean>(false);
  private readonly isExportingPdfSignal = signal<boolean>(false);
  private readonly isExportingExcelSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly formDataSignal = signal<TransactionFormData>(this.getDefaultFormData());
  private readonly searchQuerySignal = signal<string>('');
  private readonly selectedTransactionIdSignal = signal<number | null>(null);

  private readonly filterCategorySignal = signal<string | null>(null);
  private readonly filterMethodSignal = signal<string | null>(null);
  private readonly filterTypeSignal = signal<string | null>(null);

  readonly transactions = this.transactionsSignal.asReadonly();
  readonly filteredTransactions = this.filteredTransactionsSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isLoadingTransactions = this.isLoadingTransactionsSignal.asReadonly();
  readonly isDeleting = this.isDeletingSignal.asReadonly();
  readonly isExportingPdf = this.isExportingPdfSignal.asReadonly();
  readonly isExportingExcel = this.isExportingExcelSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly formData = this.formDataSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly selectedTransactionId = this.selectedTransactionIdSignal.asReadonly();

  readonly filterCategory = this.filterCategorySignal.asReadonly();
  readonly filterMethod = this.filterMethodSignal.asReadonly();
  readonly filterType = this.filterTypeSignal.asReadonly();

  readonly transactionTypes = TRANSACTION_TYPES;
  readonly transactionCategories = TRANSACTION_CATEGORIES;
  readonly transactionMethods = TRANSACTION_METHODS;
  readonly currencies = CURRENCIES;

  readonly isEditing = computed(() => this.selectedTransactionIdSignal() !== null);

  constructor(
    private readonly getTransactionsService: GetTransactionsService,
    private readonly createTransactionService: CreateTransactionService,
    private readonly updateTransactionService: UpdateTransactionService,
    private readonly deleteTransactionService: DeleteTransactionService,
    private readonly exportTransactionsService: ExportTransactionsService
  ) {}

  loadTransactions(): void {
    this.isLoadingTransactionsSignal.set(true);
    this.errorSignal.set(null);

    const filters: TransactionFilterParams = {
      category: this.filterCategorySignal(),
      method: this.filterMethodSignal(),
      type: this.filterTypeSignal()
    };

    this.getTransactionsService.execute(filters).subscribe({
      next: (resources) => {
        const transactions = TransactionAssembler.toEntities(resources);
        this.transactionsSignal.set(transactions);
        this.applyFilter(this.searchQuerySignal());
        this.isLoadingTransactionsSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load transactions');
        this.isLoadingTransactionsSignal.set(false);
      }
    });
  }

  setFilter(field: 'category' | 'method' | 'type', value: string | null): void {
    if (field === 'category') this.filterCategorySignal.set(value);
    if (field === 'method') this.filterMethodSignal.set(value);
    if (field === 'type') this.filterTypeSignal.set(value);
    this.loadTransactions();
  }

  createTransaction(): void {
    const data = this.formDataSignal();
    if (!data.transactionType || !data.transactionCategory || !data.transactionMethod || !data.amount) {
      this.errorSignal.set('Type, category, method and amount are required');
      return;
    }

    const resource: RegisterTransactionResource = {
      transactionType: data.transactionType,
      transactionCategory: data.transactionCategory,
      transactionMethod: data.transactionMethod,
      amount: Number(data.amount),
      currency: data.currency,
      description: data.description,
      transactionDate: data.transactionDate
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.createTransactionService.execute(resource).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadTransactions();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to create transaction');
        this.isLoadingSignal.set(false);
      }
    });
  }

  updateTransaction(): void {
    const id = this.selectedTransactionIdSignal();
    const data = this.formDataSignal();
    if (!id) return;
    if (!data.transactionType || !data.transactionCategory || !data.transactionMethod || !data.amount) {
      this.errorSignal.set('Type, category, method and amount are required');
      return;
    }

    const resource: UpdateTransactionResource = {
      transactionType: data.transactionType,
      transactionCategory: data.transactionCategory,
      transactionMethod: data.transactionMethod,
      amount: Number(data.amount),
      currency: data.currency,
      description: data.description,
      transactionDate: data.transactionDate
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.updateTransactionService.execute(id, resource).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadTransactions();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to update transaction');
        this.isLoadingSignal.set(false);
      }
    });
  }

  deleteTransaction(id: number): void {
    this.isDeletingSignal.set(true);
    this.errorSignal.set(null);

    this.deleteTransactionService.execute(id).subscribe({
      next: () => {
        this.isDeletingSignal.set(false);
        if (this.selectedTransactionIdSignal() === id) this.resetForm();
        this.loadTransactions();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to delete transaction');
        this.isDeletingSignal.set(false);
      }
    });
  }

  editTransaction(transaction: Transaction): void {
    this.selectedTransactionIdSignal.set(transaction.id);
    this.formDataSignal.set({
      transactionType: transaction.transactionType,
      transactionCategory: transaction.transactionCategory,
      transactionMethod: transaction.transactionMethod,
      amount: String(transaction.amount),
      currency: transaction.currency,
      description: transaction.description,
      transactionDate: transaction.transactionDate
    });
    this.errorSignal.set(null);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  onFieldChange(field: keyof TransactionFormData, value: string): void {
    this.formDataSignal.update(d => ({...d, [field]: value}));
  }

  onSearchQueryChange(query: string): void {
    this.searchQuerySignal.set(query);
    this.applyFilter(query);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  exportToPdf(): void {
    this.isExportingPdfSignal.set(true);
    this.errorSignal.set(null);

    const filters: TransactionFilterParams = {
      category: this.filterCategorySignal(),
      method: this.filterMethodSignal(),
      type: this.filterTypeSignal()
    };

    this.exportTransactionsService.exportPdf(filters).subscribe({
      next: (blob) => {
        this.isExportingPdfSignal.set(false);
        this.downloadBlob(blob, 'transactions-report.pdf', 'application/pdf');
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to export PDF');
        this.isExportingPdfSignal.set(false);
      }
    });
  }

  exportToExcel(): void {
    this.isExportingExcelSignal.set(true);
    this.errorSignal.set(null);

    const filters: TransactionFilterParams = {
      category: this.filterCategorySignal(),
      method: this.filterMethodSignal(),
      type: this.filterTypeSignal()
    };

    this.exportTransactionsService.exportExcel(filters).subscribe({
      next: (blob) => {
        this.isExportingExcelSignal.set(false);
        this.downloadBlob(blob, 'transactions-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to export Excel');
        this.isExportingExcelSignal.set(false);
      }
    });
  }

  private downloadBlob(blob: Blob, fileName: string, mimeType: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private getDefaultFormData(): TransactionFormData {
    return {
      transactionType: '',
      transactionCategory: '',
      transactionMethod: '',
      amount: '',
      currency: 'PEN',
      description: '',
      transactionDate: new Date().toISOString().split('T')[0]
    };
  }

  private resetForm(): void {
    this.formDataSignal.set(this.getDefaultFormData());
    this.selectedTransactionIdSignal.set(null);
  }

  private applyFilter(query: string): void {
    const list = this.transactionsSignal();
    const q = query.trim().toLowerCase();
    if (!q) {
      this.filteredTransactionsSignal.set(list);
      return;
    }
    this.filteredTransactionsSignal.set(
      list.filter(t =>
        t.transactionType.toLowerCase().includes(q) ||
        t.transactionCategory.toLowerCase().includes(q) ||
        t.transactionMethod.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        String(t.amount).includes(q)
      )
    );
  }
}