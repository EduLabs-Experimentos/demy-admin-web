import { BillingAccount } from '../domain/model/billing-account.entity';
import { Invoice } from '../domain/model/invoice.entity';
import { BillingAccountResource, InvoiceResource } from './billing-response';

export class BillingAssembler {
  static toInvoiceEntity(resource: InvoiceResource): Invoice {
    return new Invoice({
      id: resource.id,
      invoiceType: resource.invoiceType,
      amount: resource.amount,
      currency: resource.currency,
      description: resource.description,
      issueDate: new Date(resource.issueDate),
      dueDate: new Date(resource.dueDate),
      status: resource.status
    });
  }

  static toBillingAccountEntity(resource: BillingAccountResource): BillingAccount {
    return new BillingAccount({
      id: resource.id,
      studentId: resource.studentId,
      dniNumber: resource.dniNumber,
      academyId: resource.academyId,
      invoices: resource.invoices ? resource.invoices.map(i => this.toInvoiceEntity(i)) : []
    });
  }

  static toBillingAccountEntities(resources: BillingAccountResource[]): BillingAccount[] {
    return resources.map(resource => this.toBillingAccountEntity(resource));
  }

  static toInvoiceEntities(resources: InvoiceResource[]): Invoice[] {
    return resources.map(resource => this.toInvoiceEntity(resource));
  }
}
