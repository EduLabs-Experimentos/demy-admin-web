import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  BillingAccountResource,
  CreateBillingAccountResource,
  AssignInvoiceResource,
  InvoiceResource,
  UpdateInvoiceResource
} from './billing-response';

@Injectable({
  providedIn: 'root'
})
export class BillingApi {
  private readonly http = inject(HttpClient);
  // Usa la variable de entorno que acabamos de agregar
  private readonly basePath = `${environment.platformProviderApiBaseUrl}${environment.platformProviderBillingAccountsEndpointPath}`;

  createBillingAccount(resource: CreateBillingAccountResource): Observable<BillingAccountResource> {
    return this.http.post<BillingAccountResource>(this.basePath, resource);
  }

  getAllBillingAccounts(): Observable<BillingAccountResource[]> {
    return this.http.get<BillingAccountResource[]>(this.basePath);
  }

  getBillingAccountById(id: number): Observable<BillingAccountResource> {
    return this.http.get<BillingAccountResource>(`${this.basePath}/${id}`);
  }

  assignInvoice(billingAccountId: number, resource: AssignInvoiceResource): Observable<BillingAccountResource> {
    return this.http.post<BillingAccountResource>(`${this.basePath}/${billingAccountId}/invoices`, resource);
  }

  updateInvoice(billingAccountId: number, invoiceId: number, resource: UpdateInvoiceResource): Observable<InvoiceResource> {
    return this.http.put<InvoiceResource>(`${this.basePath}/${billingAccountId}/invoices/${invoiceId}`, resource);
  }

  deleteInvoice(billingAccountId: number, invoiceId: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${billingAccountId}/invoices/${invoiceId}`);
  }

  markInvoiceAsPaid(billingAccountId: number, invoiceId: number): Observable<InvoiceResource> {
    return this.http.post<InvoiceResource>(`${this.basePath}/${billingAccountId}/invoices/${invoiceId}/mark-as-paid`, {});
  }

  getInvoicesByAccountId(billingAccountId: number): Observable<InvoiceResource[]> {
    return this.http.get<InvoiceResource[]>(`${this.basePath}/${billingAccountId}/invoices`);
  }

  getInvoicesByStudentId(studentId: number): Observable<InvoiceResource[]> {
    return this.http.get<InvoiceResource[]>(`${this.basePath}/invoices/by-student-id/${studentId}`);
  }

  getInvoicesByStudentDni(dniNumber: string): Observable<InvoiceResource[]> {
    return this.http.get<InvoiceResource[]>(`${this.basePath}/invoices/by-student-dni/${dniNumber}`);
  }
}
