import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingStore } from '../../../application/billing.store';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ButtonModule, InputTextModule, SelectModule, DatePickerModule],
  templateUrl: './invoice-form.html',
})
export class InvoiceForm {
  @Input() accountId!: number;
  @Output() cancel = new EventEmitter<void>();

  protected store = inject(BillingStore);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    invoiceType: ['', Validators.required],
    amount: ['', Validators.required],
    currency: ['PEN', Validators.required],
    description: ['', Validators.required],
    issueDate: [new Date(), Validators.required],
    dueDate: [null, Validators.required],
    status: ['PENDING', Validators.required]
  });

  typeOptions = [
    { label: 'Matrícula', value: 'STUDENT_ENROLLMENT' },
    { label: 'Pensión', value: 'STUDENT_MONTHLY_FEE' },
    { label:' Pago único', value:'STUDENT_ONE_TIME_PAYMENT'},
    { label: 'Otros', value: 'OTHER' }
  ];

  isInvalid(field: string) {
    const ctrl = this.form.get(field);
    return ctrl?.invalid && ctrl?.touched;
  }

  onSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.store.assignInvoice(this.accountId, this.form.value, () => {
      this.form.reset({ currency: 'PEN', status: 'PENDING', issueDate: new Date() });
      this.cancel.emit();
    });
  }
}
