import { Component, inject, signal, computed } from '@angular/core';
import { BillingStore } from '../../../application/billing.store';
import { StudentsStore } from '../../../../students/application/students';
import { Invoice } from '../../../domain/model/invoice.entity';
import { Student } from '../../../../students/domain/model/student.entity';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InvoiceForm } from '../../components/invoice-form/invoice-form';
import { InvoiceList } from '../../components/invoice-list/invoice-list';

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [TranslatePipe, ButtonModule, InputTextModule, InvoiceForm, InvoiceList],
  templateUrl: './billing-page.html',
  styleUrl: './billing-page.scss'
})
export class BillingPage {
  store = inject(BillingStore);
  studentsStore = inject(StudentsStore);

  selectedStudentId = signal<number | null>(null);
  searchQuery = signal<string>('');
  showInvoiceForm = false;
  editingInvoice: Invoice | null = null;

  selectedAccount = computed(() => {
    const studentId = this.selectedStudentId();
    return studentId ? this.store.getAccountByStudentId(studentId) || null : null;
  });

  filteredStudents = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const students = this.studentsStore.students();
    if (!query) return students;
    return students.filter(s =>
      s.id.toString().includes(query) ||
      s.dni.toLowerCase().includes(query) ||
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query)
    );
  });

  selectStudent(student: Student) {
    this.selectedStudentId.set(student.id);
    this.cancelInvoiceForm();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  startCreateInvoice() {
    this.editingInvoice = null;
    this.showInvoiceForm = true;
  }

  startEditInvoice(invoice: Invoice) {
    this.editingInvoice = invoice;
    this.showInvoiceForm = true;
  }

  cancelInvoiceForm() {
    this.showInvoiceForm = false;
    this.editingInvoice = null;
  }

  getStudentName(studentId: number): string {
    const student = this.studentsStore.students().find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : '';
  }
}
