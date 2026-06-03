import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TransactionApi} from '../../infrastructure/transaction-api';

@Injectable({providedIn: 'root'})
export class DeleteTransactionService {
  constructor(private readonly api: TransactionApi) {}

  execute(transactionId: number): Observable<void> {
    return this.api.delete(transactionId);
  }
}