import { Component, inject, signal } from '@angular/core';
import { BillingStore } from '../../../application/billing.store';
import { BillingAccount } from '../../../domain/model/billing-account.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { BillingAccountForm } from '../../components/billing-account-form/billing-account-form';
import { InvoiceForm } from '../../components/invoice-form/invoice-form';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [TranslatePipe, ButtonModule, TableModule, DatePipe, BillingAccountForm, InvoiceForm],
  templateUrl: './billing-page.html',
  styleUrl: './billing-page.scss' // Usaremos este archivo para el CSS principal
})
export class BillingPage {
  store = inject(BillingStore);

  // Variables que el HTML necesita
  selectedAccount = signal<BillingAccount | null>(null);
  showInvoiceForm = false;

  selectAccount(account: BillingAccount) {
    this.selectedAccount.set(account);
    this.showInvoiceForm = false; // Cerramos el form si cambiamos de cuenta
  }
}
