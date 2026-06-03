import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Invoice } from '../../../domain/model/invoice.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [TableModule, TranslatePipe, DatePipe],
  templateUrl: './invoice-list.html'
})
export class InvoiceList {
  @Input() invoices: Invoice[] = [];
  @Output() markPaid = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Invoice>();
}
