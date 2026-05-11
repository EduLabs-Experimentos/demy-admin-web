import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '../../../iam/application/iam.store';
import {AcademyRegisterRequest} from '../../../iam/infrastructure/academy-register-request';

@Component({
  selector: 'app-setup-academy-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './setup-academy-form.html',
  styleUrl: './setup-academy-form.scss'
})
export class SetupAcademyForm {
  private router = inject(Router);
  protected store = inject(IamStore);

  form = new FormGroup({
    academyName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    academyDescription: new FormControl('', {nonNullable: true}),
    ruc: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{11}$/)]}),
    street: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    district: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    province: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    department: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    emailAddress: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    countryCode: new FormControl('+51', {nonNullable: true}),
    phone: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{9}$/)]})
  });

  setupAcademy() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
      console.error('Admin ID not found');
      return;
    }
    const request: AcademyRegisterRequest = {
      academyName: this.form.value.academyName!,
      academyDescription: this.form.value.academyDescription || '',
      ruc: this.form.value.ruc!,
      street: this.form.value.street!,
      district: this.form.value.district!,
      province: this.form.value.province!,
      department: this.form.value.department!,
      emailAddress: this.form.value.emailAddress!,
      countryCode: this.form.value.countryCode!,
      phone: this.form.value.phone!,
      administratorId: parseInt(adminId, 10)
    };
    this.store.setupAcademy(request, this.router);
  }

  getRucError(): string {
    const control = this.form.controls['ruc'];
    if (control.hasError('required')) return 'El RUC es requerido.';
    if (control.hasError('pattern')) return 'El RUC debe tener 11 dígitos.';
    return 'RUC inválido.';
  }

  getPhoneError(): string {
    const control = this.form.controls['phone'];
    if (control.hasError('required')) return 'El teléfono es requerido.';
    if (control.hasError('pattern')) return 'El teléfono debe tener 9 dígitos.';
    return 'Teléfono inválido.';
  }

  getEmailError(): string {
    const control = this.form.controls['emailAddress'];
    if (control.hasError('required')) return 'El email es requerido.';
    if (control.hasError('email')) return 'Ingresa un email válido.';
    return 'Email inválido.';
  }
}