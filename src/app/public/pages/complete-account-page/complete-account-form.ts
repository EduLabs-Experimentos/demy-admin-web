import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '../../../iam/application/iam.store';
import {AdminRegisterRequest} from '../../../iam/infrastructure/admin-register-request';

@Component({
  selector: 'app-complete-account-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './complete-account-form.html',
  styleUrl: './complete-account-form.scss'
})
export class CompleteAccountForm {
  private router = inject(Router);
  protected store = inject(IamStore);

  form = new FormGroup({
    firstName: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(2)]}),
    lastName: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(2)]}),
    countryCode: new FormControl('+51', {nonNullable: true, validators: [Validators.required]}),
    phone: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{9}$/)]}),
    dniNumber: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{8}$/)]})
  });

  completeAccount() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    const request: AdminRegisterRequest = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      countryCode: this.form.value.countryCode!,
      phone: this.form.value.phone!,
      dniNumber: this.form.value.dniNumber!,
      userId: parseInt(userId, 10)
    };
    this.store.completeAccount(request, this.router);
  }

  getPhoneError(): string {
    const control = this.form.controls['phone'];
    if (control.hasError('required')) return 'El teléfono es requerido.';
    if (control.hasError('pattern')) return 'El teléfono debe tener 9 dígitos.';
    return 'Teléfono inválido.';
  }

  getDniError(): string {
    const control = this.form.controls['dniNumber'];
    if (control.hasError('required')) return 'El DNI es requerido.';
    if (control.hasError('pattern')) return 'El DNI debe tener 8 dígitos.';
    return 'DNI inválido.';
  }
}