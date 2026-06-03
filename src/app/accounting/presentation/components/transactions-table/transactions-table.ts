import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DecimalPipe, DatePipe} from '@angular/common';
import {AccountingStore} from '../../../application/store/accounting.store';
import {Transaction} from '../../../domain/model/transaction.entity';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [TranslateModule, InputTextModule, ButtonModule, DecimalPipe, DatePipe],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.scss'
})
export class TransactionsTable {
  protected readonly store = inject(AccountingStore);

  editTransaction(id: number): void {
    const transaction = this.store.transactions().find(t => t.id === id);
    if (transaction) this.store.editTransaction(transaction);
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.store.deleteTransaction(id);
    }
  }

  onSearchChange(query: string): void {
    this.store.onSearchQueryChange(query);
  }

  onFilterChange(field: 'category' | 'method' | 'type', value: string): void {
    this.store.setFilter(field, value || null);
  }

  exportPdf(): void {
    this.store.exportToPdf();
  }

  exportExcel(): void {
    this.store.exportToExcel();
  }
}