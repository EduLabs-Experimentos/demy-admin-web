import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TransactionApi} from '../../infrastructure/transaction-api';
import {TransactionFilterParams} from '../../infrastructure/transaction-response';

@Injectable({providedIn: 'root'})
export class ExportTransactionsService {
  constructor(private readonly api: TransactionApi) {}

  exportPdf(filters?: TransactionFilterParams): Observable<Blob> {
    return this.api.exportPdf(filters);
  }

  exportExcel(filters?: TransactionFilterParams): Observable<Blob> {
    return this.api.exportExcel(filters);
  }
}