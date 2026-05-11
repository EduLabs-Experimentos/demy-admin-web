import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BillingStore } from '../../../application/billing.store';
import { AssignInvoiceResource } from '../../../infrastructure/billing-response';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './billing-page.html',
  styleUrl: './billing-page.scss'
})
export class BillingPage {
  store = inject(BillingStore);

  searchDni = signal('');
  searchedDni = signal('');
  searchError = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  showConfirmDialog = signal(false);
  private pendingAction = signal<(() => void) | null>(null);

  invoiceType = signal('');
  invoiceAmount = signal('');
  invoiceDescription = signal('');
  invoiceDueDate = signal('');

  foundAccount = computed(() => {
    const dni = this.searchedDni();
    if (!dni) return undefined;
    return this.store.accounts().find(a => a.dniNumber === dni);
  });

  typeOptions = [
    { label: 'Matrícula', value: 'STUDENT_ENROLLMENT' },
    { label: 'Pensión', value: 'STUDENT_MONTHLY_FEE' },
    { label: 'Pago único', value: 'STUDENT_ONE_TIME_PAYMENT' },
    { label: 'Otros', value: 'OTHER' }
  ];

  onSearch(): void {
    const dni = this.searchDni();
    this.searchedDni.set(dni);
    const account = this.store.accounts().find(a => a.dniNumber === dni);
    this.searchError.set(account ? null : 'No billing account found for this DNI');
    this.store.clearError();
    this.successMessage.set(null);
  }

  assignInvoice(): void {
    const account = this.foundAccount();
    if (!account) return;
    const today = new Date().toISOString().split('T')[0];
    const resource: AssignInvoiceResource = {
      invoiceType: this.invoiceType(),
      amount: this.invoiceAmount(),
      currency: 'PEN',
      description: this.invoiceDescription(),
      issueDate: today,
      dueDate: this.invoiceDueDate(),
      status: 'PENDING'
    };
    this.store.clearError();
    this.store.assignInvoice(account.id, resource, () => {
      this.invoiceType.set('');
      this.invoiceAmount.set('');
      this.invoiceDescription.set('');
      this.invoiceDueDate.set('');
      this.showSuccess('Invoice assigned successfully');
    });
  }

  requestMarkPaid(invoiceId: number): void {
    this.pendingAction.set(() => this.doMarkPaid(invoiceId));
    this.showConfirmDialog.set(true);
  }

  requestDelete(invoiceId: number): void {
    this.pendingAction.set(() => this.doDelete(invoiceId));
    this.showConfirmDialog.set(true);
  }

  confirmAction(): void {
    const action = this.pendingAction();
    if (action) action();
  }

  cancelDialog(): void {
    this.showConfirmDialog.set(false);
    this.pendingAction.set(null);
  }

  private doMarkPaid(invoiceId: number): void {
    const account = this.foundAccount();
    if (!account) return;
    this.store.clearError();
    this.store.markInvoiceAsPaid(account.id, invoiceId, () => {
      this.showConfirmDialog.set(false);
      this.pendingAction.set(null);
      this.showSuccess('Invoice marked as paid');
    });
  }

  private doDelete(invoiceId: number): void {
    const account = this.foundAccount();
    if (!account) return;
    this.store.clearError();
    this.store.deleteInvoice(account.id, invoiceId, () => {
      this.showConfirmDialog.set(false);
      this.pendingAction.set(null);
      this.showSuccess('Invoice deleted successfully');
    });
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 4000);
  }
}
