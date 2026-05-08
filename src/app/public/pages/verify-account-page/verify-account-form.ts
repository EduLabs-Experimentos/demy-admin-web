import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '../../../iam/application/iam.store';
import {VerifyRequest} from '../../../iam/infrastructure/verify-request';

@Component({
  selector: 'app-verify-account-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './verify-account-form.html',
  styleUrl: './verify-account-form.scss'
})
export class VerifyAccountForm {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected store = inject(IamStore);

  email: string = '';
  isResending: boolean = false;

  form = new FormGroup({
    code: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)]})
  });

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  get emailValue(): string {
    return this.email;
  }

  verify() {
    if (this.form.invalid || !this.email) return;
    const request: VerifyRequest = {
      email: this.email,
      code: this.form.value.code!
    };
    this.store.verify(request, this.router);
  }

  resendCode() {
    if (!this.email) return;
    this.isResending = true;
    this.store.resendCode(this.email).subscribe({
      next: () => {
        this.isResending = false;
      },
      error: () => {
        this.isResending = false;
      }
    });
  }
}