import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {TransactionResource, RegisterTransactionResource, UpdateTransactionResource, TransactionFilterParams} from './transaction-response';
import {RegisterTransactionRequest, UpdateTransactionRequest, TransactionFilterRequest} from './transaction-request';

@Injectable({providedIn: 'root'})
export class TransactionEndpoint {
  private readonly baseUrl: string;
  private readonly reportsUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderTransactionsEndpointPath}`;
    this.reportsUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderReportsTransactionsEndpointPath}`;
  }

  getAll(filters?: TransactionFilterParams): Observable<TransactionResource[]> {
    const params = this.buildFilterParams(filters);
    return this.http.get<TransactionResource[]>(this.baseUrl, {params}).pipe(
      catchError(this.handleError('Failed to fetch transactions'))
    );
  }

  getById(transactionId: number): Observable<TransactionResource> {
    return this.http.get<TransactionResource>(`${this.baseUrl}/${transactionId}`).pipe(
      catchError(this.handleError('Failed to fetch transaction'))
    );
  }

  create(request: RegisterTransactionRequest): Observable<TransactionResource> {
    return this.http.post<TransactionResource>(this.baseUrl, request).pipe(
      catchError(this.handleError('Failed to create transaction'))
    );
  }

  update(transactionId: number, request: UpdateTransactionRequest): Observable<TransactionResource> {
    return this.http.put<TransactionResource>(`${this.baseUrl}/${transactionId}`, request).pipe(
      catchError(this.handleError('Failed to update transaction'))
    );
  }

  delete(transactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${transactionId}`).pipe(
      catchError(this.handleError('Failed to delete transaction'))
    );
  }

  exportPdf(filters?: TransactionFilterParams): Observable<Blob> {
    const params = this.buildFilterParams(filters);
    return this.http.get(`${this.reportsUrl}/pdf`, {
      params,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError('Failed to export PDF'))
    );
  }

  exportExcel(filters?: TransactionFilterParams): Observable<Blob> {
    const params = this.buildFilterParams(filters);
    return this.http.get(`${this.reportsUrl}/excel`, {
      params,
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError('Failed to export Excel'))
    );
  }

  private buildFilterParams(filters?: TransactionFilterParams): Record<string, string> {
    const params: Record<string, string> = {};
    if (filters?.category) params['category'] = filters.category;
    if (filters?.method) params['method'] = filters.method;
    if (filters?.type) params['type'] = filters.type;
    return params;
  }

  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      let errorMessage = operation;
      if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else if (error.status === 0) {
        errorMessage = `${operation}: Network error or server unavailable`;
      } else if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.error?.message) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: Server returned code ${error.status}`;
      }
      return throwError(() => new Error(errorMessage));
    };
  }
}