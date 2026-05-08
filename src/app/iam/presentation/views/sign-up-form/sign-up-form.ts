import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {CheckboxModule} from 'primeng/checkbox';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '../../../application/iam.store';
import {SignUpCommand} from '../../../domain/model/sign-up.command';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss'
})
export class SignUpForm extends BaseForm {
  private router = inject(Router);
  protected store = inject(IamStore);

  form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(8)]}),
    terms: new FormControl(false, {nonNullable: true, validators: [Validators.requiredTrue]})
  });

  performSignUp() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.form.value;
    const signUpCommand = new SignUpCommand({
      emailAddress: formData.email!,
      password: formData.password!,
      roles: ['ROLE_USER']
    });
    this.store.signUp(signUpCommand, this.router);
  }
}