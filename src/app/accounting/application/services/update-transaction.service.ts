import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TransactionApi} from '../../infrastructure/transaction-api';
import {TransactionResource, UpdateTransactionResource} from '../../infrastructure/transaction-response';
import {UpdateTransactionRequest} from '../../infrastructure/transaction-request';
import {TransactionAssembler} from '../../infrastructure/transaction-assembler';

@Injectable({providedIn: 'root'})
export class UpdateTransactionService {
  constructor(private readonly api: TransactionApi) {}

  execute(transactionId: number, resource: UpdateTransactionResource): Observable<TransactionResource> {
    const request: UpdateTransactionRequest = TransactionAssembler.toUpdateRequest(resource);
    return this.api.update(transactionId, request);
  }
}