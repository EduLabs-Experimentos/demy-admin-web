import {Component, effect, inject, OnDestroy, untracked} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '../../../iam/application/iam.store';
import {RequestResetPasswordRequest} from '../../../iam/infrastructure/request-reset-password-request';
import {VerifyResetCodeRequest} from '../../../iam/infrastructure/verify-reset-code-request';
import {ResetPasswordRequest} from '../../../iam/infrastructure/reset-password-request';
import {LanguageSwitcher} from '../../../shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, TranslateModule, InputTextModule, PasswordModule, ButtonModule, LanguageSwitcher],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss'
})
export class ResetPasswordPage implements OnDestroy {
  private router = inject(Router);
  protected store = inject(IamStore);

  protected step: 'email' | 'code' | 'password' = 'email';
  private emailAddress: string = '';
  private pendingStepChange = false;

  emailForm = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]})
  });

  codeForm = new FormGroup({
    code: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  passwordForm = new FormGroup({
    password: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(8)]}),
    confirmPassword: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  private loadingEffect = effect(() => {
    const isLoading = this.store.resetPasswordLoading();
    const error = untracked(() => this.store.resetPasswordError());
    if (!isLoading && this.pendingStepChange) {
      this.pendingStepChange = false;
      if (!error) {
        if (this.step === 'email') {
          this.step = 'code';
        } else if (this.step === 'code') {
          this.step = 'password';
        }
      }
    }
  });

  ngOnDestroy(): void {
    this.loadingEffect.destroy();
    this.store.clearResetPasswordState();
  }

  requestReset() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.emailAddress = this.emailForm.value.email!;
    const request: RequestResetPasswordRequest = {emailAddress: this.emailAddress};
    this.pendingStepChange = true;
    this.store.requestResetPassword(request);
  }

  verifyCode() {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }
    const request: VerifyResetCodeRequest = {
      emailAddress: this.emailAddress,
      code: this.codeForm.value.code!
    };
    this.pendingStepChange = true;
    this.store.verifyResetCode(request);
  }

  resetPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const request: ResetPasswordRequest = {
      emailAddress: this.emailAddress,
      password: this.passwordForm.value.password!,
      confirmPassword: this.passwordForm.value.confirmPassword!
    };
    this.store.resetPassword(request, this.router);
  }

  goBack() {
    this.store.clearResetPasswordState();
    if (this.step === 'code') this.step = 'email';
    else if (this.step === 'password') this.step = 'code';
  }
}
