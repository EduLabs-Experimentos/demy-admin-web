import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TransactionApi} from '../../infrastructure/transaction-api';
import {TransactionResource} from '../../infrastructure/transaction-response';
import {TransactionFilterParams} from '../../infrastructure/transaction-response';

@Injectable({providedIn: 'root'})
export class GetTransactionsService {
  constructor(private readonly api: TransactionApi) {}

  execute(filters?: TransactionFilterParams): Observable<TransactionResource[]> {
    return this.api.getAll(filters);
  }

  executeById(transactionId: number): Observable<TransactionResource> {
    return this.api.getById(transactionId);
  }
}