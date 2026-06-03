import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {ButtonModule} from 'primeng/button';
import {DatePickerModule} from 'primeng/datepicker';
import {AccountingStore} from '../../../application/store/accounting.store';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [TranslateModule, InputTextModule, InputNumberModule, ButtonModule, DatePickerModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss'
})
export class TransactionForm {
  protected readonly store = inject(AccountingStore);

  submit(): void {
    if (this.store.isEditing()) this.store.updateTransaction();
    else this.store.createTransaction();
  }
}