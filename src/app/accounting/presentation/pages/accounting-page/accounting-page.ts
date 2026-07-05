import {Component, inject, OnInit} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {TransactionForm} from '../../components/transaction-form/transaction-form';
import {TransactionsTable} from '../../components/transactions-table/transactions-table';
import {AccountingStore} from '../../../application/store/accounting.store';
import {UmuxSurveyDialog} from '../../../../shared/presentation/components/umux-survey-dialog/umux-survey-dialog';

@Component({
  selector: 'app-accounting-page',
  standalone: true,
  imports: [TranslateModule, TransactionForm, TransactionsTable, UmuxSurveyDialog],
  templateUrl: './accounting-page.html',
  styleUrl: './accounting-page.scss'
})
export class AccountingPage implements OnInit {
  protected readonly store = inject(AccountingStore);

  ngOnInit(): void {
    this.store.loadTransactions();
  }
}
