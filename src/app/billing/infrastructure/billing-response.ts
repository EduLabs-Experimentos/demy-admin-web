export interface InvoiceResource {
  id: number;
  invoiceType: string;
  amount: string;
  currency: string;
  description: string;
  issueDate: string;
  dueDate: string;
  status: string;
}

export interface BillingAccountResource {
  id: number;
  studentId: number;
  dniNumber: string;
  academyId: number;
  invoices: InvoiceResource[];
}

export interface CreateBillingAccountResource {
  studentId: number;
  dniNumber: string;
}

export interface AssignInvoiceResource {
  invoiceType: string;
  amount: string;
  currency: string;
  description: string;
  issueDate: string;
  dueDate: string;
  status: string;
}

export interface UpdateInvoiceResource {
  invoiceType: string;
  amount: string;
  currency: string;
  description: string;
  status: string;
}
