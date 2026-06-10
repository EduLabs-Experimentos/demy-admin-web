import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TransactionEndpoint} from './transaction-endpoint';
import {TransactionResource, RegisterTransactionResource, UpdateTransactionResource, TransactionFilterParams} from './transaction-response';
import {RegisterTransactionRequest, UpdateTransactionRequest} from './transaction-request';

@Injectable({providedIn: 'root'})
export class TransactionApi {
  private readonly endpoint: TransactionEndpoint;

  constructor(http: HttpClient) {
    this.endpoint = new TransactionEndpoint(http);
  }

  getAll(filters?: TransactionFilterParams): Observable<TransactionResource[]> {
    return this.endpoint.getAll(filters);
  }

  getById(id: number): Observable<TransactionResource> {
    return this.endpoint.getById(id);
  }

  create(request: RegisterTransactionRequest): Observable<TransactionResource> {
    return this.endpoint.create(request);
  }

  update(id: number, request: UpdateTransactionRequest): Observable<TransactionResource> {
    return this.endpoint.update(id, request);
  }

  delete(id: number): Observable<void> {
    return this.endpoint.delete(id);
  }

  exportPdf(filters?: TransactionFilterParams): Observable<Blob> {
    return this.endpoint.exportPdf(filters);
  }

  exportExcel(filters?: TransactionFilterParams): Observable<Blob> {
    return this.endpoint.exportExcel(filters);
  }
}