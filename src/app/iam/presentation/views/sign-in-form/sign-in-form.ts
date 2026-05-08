import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '../../../application/iam.store';
import {SignInCommand} from '../../../domain/model/sign-in.command';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';

@Component({
  selector: 'app-sign-in-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.scss'
})
export class SignInForm extends BaseForm {
  private router = inject(Router);
  protected store = inject(IamStore);

  form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  performSignIn() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const signInCommand = new SignInCommand({
      emailAddress: this.form.value.email!,
      password: this.form.value.password!
    });
    this.store.signIn(signInCommand, this.router);
  }
}
