import { Component, inject, signal, computed } from '@angular/core';
import { BillingStore } from '../../../application/billing.store';
import { BillingAccount } from '../../../domain/model/billing-account.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { BillingAccountForm } from '../../components/billing-account-form/billing-account-form';
import { InvoiceForm } from '../../components/invoice-form/invoice-form';
import { InvoiceList } from '../../components/invoice-list/invoice-list';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [TranslatePipe, ButtonModule, BillingAccountForm, InvoiceForm, InvoiceList],
  templateUrl: './billing-page.html',
  styleUrl: './billing-page.scss'
})
export class BillingPage {
  store = inject(BillingStore);

  // Guardamos SOLO el ID
  selectedAccountId = signal<number | null>(null);
  showInvoiceForm = false;

  // Computed: ¡Siempre tiene los datos más recientes del Store!
  selectedAccount = computed(() => {
    const id = this.selectedAccountId();
    return id ? this.store.accounts().find(acc => acc.id === id) || null : null;
  });

  selectAccount(account: BillingAccount) {
    this.selectedAccountId.set(account.id);
    this.showInvoiceForm = false;
  }
}
