import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingStore } from '../../../application/billing.store';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-billing-account-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ButtonModule, InputTextModule],
  templateUrl: './billing-account-form.html'
})
export class BillingAccountForm {
  store = inject(BillingStore);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    studentId: ['', [Validators.required, Validators.min(1)]],
    dniNumber: ['', Validators.required]
  });

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.createAccount(this.form.value.studentId, this.form.value.dniNumber, () => {
      this.form.reset();
    });
  }
}
