import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingStore } from '../../../application/billing.store';
import { Invoice } from '../../../domain/model/invoice.entity';
import { TranslateService } from '@ngx-translate/core';
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
export class InvoiceForm implements OnInit {
  @Input() accountId!: number;
  @Input() invoice: Invoice | null = null;
  @Output() cancel = new EventEmitter<void>();

  protected store = inject(BillingStore);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  form!: FormGroup;
  typeOptions: { label: string; value: string }[] = [];
  currencyOptions = [
    { label: 'PEN', value: 'PEN' },
    { label: 'USD', value: 'USD' }
  ];
  statusOptions: { label: string; value: string }[] = [];

  ngOnInit() {
    this.initForm();
    this.initOptions();
  }

  private initForm() {
    const isEdit = !!this.invoice;
    this.form = this.fb.group({
      invoiceType: [isEdit ? this.invoice!.invoiceType : '', Validators.required],
      amount: [isEdit ? this.invoice!.amount : '', Validators.required],
      currency: [isEdit ? this.invoice!.currency : 'PEN', Validators.required],
      description: [isEdit ? this.invoice!.description : '', Validators.required],
      issueDate: [isEdit ? new Date(this.invoice!.issueDate) : new Date(), Validators.required],
      dueDate: [isEdit ? new Date(this.invoice!.dueDate) : null, Validators.required],
      status: [isEdit ? this.invoice!.status : 'PENDING', Validators.required]
    });
  }

  private initOptions() {
    this.translate.get([
      'billing.invoice.types.STUDENT_ENROLLMENT',
      'billing.invoice.types.STUDENT_MONTHLY_FEE',
      'billing.invoice.types.STUDENT_ONE_TIME_PAYMENT',
      'billing.invoice.types.OTHER'
    ]).subscribe(translations => {
      this.typeOptions = [
        { label: translations['billing.invoice.types.STUDENT_ENROLLMENT'], value: 'STUDENT_ENROLLMENT' },
        { label: translations['billing.invoice.types.STUDENT_MONTHLY_FEE'], value: 'STUDENT_MONTHLY_FEE' },
        { label: translations['billing.invoice.types.STUDENT_ONE_TIME_PAYMENT'], value: 'STUDENT_ONE_TIME_PAYMENT' },
        { label: translations['billing.invoice.types.OTHER'], value: 'OTHER' }
      ];
    });

    this.translate.get([
      'billing.invoice.statuses.PENDING',
      'billing.invoice.statuses.PAID',
      'billing.invoice.statuses.OVERDUE',
      'billing.invoice.statuses.CANCELED'
    ]).subscribe(translations => {
      this.statusOptions = [
        { label: translations['billing.invoice.statuses.PENDING'], value: 'PENDING' },
        { label: translations['billing.invoice.statuses.PAID'], value: 'PAID' },
        { label: translations['billing.invoice.statuses.OVERDUE'], value: 'OVERDUE' },
        { label: translations['billing.invoice.statuses.CANCELED'], value: 'CANCELED' }
      ];
    });
  }

  isInvalid(field: string) {
    const ctrl = this.form.get(field);
    return ctrl?.invalid && ctrl?.touched;
  }

  onSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const isEdit = !!this.invoice;
    const formValue = this.form.value;

    if (isEdit) {
      this.store.updateInvoice(this.accountId, this.invoice!.id, formValue, () => {
        this.cancel.emit();
      });
    } else {
      this.store.assignInvoice(this.accountId, formValue, () => {
        this.form.reset({ currency: 'PEN', status: 'PENDING', issueDate: new Date() });
        this.cancel.emit();
      });
    }
  }
}
