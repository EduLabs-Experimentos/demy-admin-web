import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {TransactionApi} from '../../infrastructure/transaction-api';
import {TransactionResource, RegisterTransactionResource} from '../../infrastructure/transaction-response';
import {RegisterTransactionRequest} from '../../infrastructure/transaction-request';
import {TransactionAssembler} from '../../infrastructure/transaction-assembler';

@Injectable({providedIn: 'root'})
export class CreateTransactionService {
  constructor(private readonly api: TransactionApi) {}

  execute(resource: RegisterTransactionResource): Observable<TransactionResource> {
    const request: RegisterTransactionRequest = TransactionAssembler.toCreateRequest(resource);
    return this.api.create(request);
  }
}