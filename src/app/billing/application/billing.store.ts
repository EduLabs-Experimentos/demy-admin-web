import { computed, Injectable, signal } from '@angular/core';
import { BillingAccount } from '../domain/model/billing-account.entity';
import { Invoice } from '../domain/model/invoice.entity';
import { BillingApi } from '../infrastructure/billing-api';
import { BillingAssembler } from '../infrastructure/billing-assembler';
import {
  CreateBillingAccountResource,
  AssignInvoiceResource,
  UpdateInvoiceResource
} from '../infrastructure/billing-response';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingStore {
  // --- Estado Global (Signals Privados) ---
  private readonly accountsSignal = signal<BillingAccount[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // --- Estado de Solo Lectura ---
  readonly accounts = this.accountsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // --- Propiedades Computadas ---
  readonly totalAccounts = computed(() => this.accounts().length);

  constructor(private billingApi: BillingApi) {
    this.loadAllAccounts();
  }

  clearError() {
    this.errorSignal.set(null);
  }

  loadAllAccounts() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.billingApi.getAllBillingAccounts().pipe(retry(2)).subscribe({
      next: (resources) => {
        const entities = BillingAssembler.toBillingAccountEntities(resources);
        this.accountsSignal.set(entities);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to load billing accounts'));
        this.loadingSignal.set(false);
      }
    });
  }

  createAccount(studentId: number, dniNumber: string, onSuccess?: () => void) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    const resource: CreateBillingAccountResource = { studentId, dniNumber };

    this.billingApi.createBillingAccount(resource).pipe(retry(2)).subscribe({
      next: (accountRes) => {
        const newAccount = BillingAssembler.toBillingAccountEntity(accountRes);
        this.accountsSignal.update(accounts => [...accounts, newAccount]);
        this.loadingSignal.set(false);
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to create billing account'));
        this.loadingSignal.set(false);
      }
    });
  }

  assignInvoice(accountId: number, resource: AssignInvoiceResource, onSuccess?: () => void) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.billingApi.assignInvoice(accountId, resource).pipe(retry(2)).subscribe({
      next: (accountRes) => {
        // El backend devuelve la cuenta completa actualizada
        const updatedAccount = BillingAssembler.toBillingAccountEntity(accountRes);
        this.accountsSignal.update(accounts =>
          accounts.map(acc => acc.id === accountId ? updatedAccount : acc)
        );
        this.loadingSignal.set(false);
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to assign invoice'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateInvoice(accountId: number, invoiceId: number, resource: UpdateInvoiceResource, onSuccess?: () => void) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.billingApi.updateInvoice(accountId, invoiceId, resource).pipe(retry(2)).subscribe({
      next: (invoiceRes) => {
        const updatedInvoice = BillingAssembler.toInvoiceEntity(invoiceRes);
        this.updateInvoiceInState(accountId, updatedInvoice);
        this.loadingSignal.set(false);
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to update invoice'));
        this.loadingSignal.set(false);
      }
    });
  }

  markInvoiceAsPaid(accountId: number, invoiceId: number, onSuccess?: () => void) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.billingApi.markInvoiceAsPaid(accountId, invoiceId).pipe(retry(2)).subscribe({
      next: (invoiceRes) => {
        const updatedInvoice = BillingAssembler.toInvoiceEntity(invoiceRes);
        this.updateInvoiceInState(accountId, updatedInvoice);
        this.loadingSignal.set(false);
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to mark as paid'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteInvoice(accountId: number, invoiceId: number, onSuccess?: () => void) {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.billingApi.deleteInvoice(accountId, invoiceId).pipe(retry(2)).subscribe({
      next: () => {
        this.accountsSignal.update(accounts =>
          accounts.map(acc => {
            if (acc.id === accountId) {
              const filteredInvoices = acc.invoices.filter(inv => inv.id !== invoiceId);
              // Mapeo explícito usando los getters
              return new BillingAccount({
                id: acc.id,
                studentId: acc.studentId,
                dniNumber: acc.dniNumber,
                academyId: acc.academyId,
                invoices: filteredInvoices
              });
            }
            return acc;
          })
        );
        this.loadingSignal.set(false);
        if (onSuccess) onSuccess();
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete invoice (maybe it is already paid)'));
        this.loadingSignal.set(false);
      }
    });
  }

  // --- Utilidades Internas ---

  private updateInvoiceInState(accountId: number, updatedInvoice: Invoice) {
    this.accountsSignal.update(accounts =>
      accounts.map(acc => {
        if (acc.id === accountId) {
          const updatedInvoices = acc.invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv);
          // Mapeo explícito usando los getters
          return new BillingAccount({
            id: acc.id,
            studentId: acc.studentId,
            dniNumber: acc.dniNumber,
            academyId: acc.academyId,
            invoices: updatedInvoices
          });
        }
        return acc;
      })
    );
  }

  private formatError(error: any, fallback: string): string {
    if (error && error.error && typeof error.error.message === 'string') {
      return error.error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return fallback;
  }
}
