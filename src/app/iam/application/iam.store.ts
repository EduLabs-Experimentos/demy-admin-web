import {computed, Injectable, signal} from '@angular/core';
import {Admin} from '../domain/model/admin.entity';
import {Academy} from '../domain/model/academy.entity';
import {SignInCommand} from '../domain/model/sign-in.command';
import {Router} from '@angular/router';
import {IamApi} from '../infrastructure/iam-api';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {VerifyRequest} from '../infrastructure/verify-request';
import {AdminRegisterRequest} from '../infrastructure/admin-register-request';
import {AcademyRegisterRequest} from '../infrastructure/academy-register-request';
import {RequestResetPasswordRequest} from '../infrastructure/request-reset-password-request';
import {VerifyResetCodeRequest} from '../infrastructure/verify-reset-code-request';
import {ResetPasswordRequest} from '../infrastructure/reset-password-request';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class IamStore {
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentEmailSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<number | null>(null);
  private readonly currentAdminSignal = signal<Admin | null>(null);
  private readonly currentAcademySignal = signal<Academy | null>(null);

  readonly isSignedIn = this.isSignedInSignal.asReadonly();
  readonly loadingUsers = signal<boolean>(false);
  readonly signInError = signal<string | null>(null);
  readonly signUpError = signal<string | null>(null);
  readonly verifyError = signal<string | null>(null);
  readonly completeAccountError = signal<string | null>(null);
  readonly setupAcademyError = signal<string | null>(null);
  readonly resetPasswordLoading = signal<boolean>(false);
  readonly resetPasswordError = signal<string | null>(null);
  readonly resetPasswordSuccess = signal<string | null>(null);
  readonly currentEmail = this.currentEmailSignal.asReadonly();
  readonly currentUserId = this.currentUserIdSignal.asReadonly();
  readonly currentToken = computed(() => this.isSignedIn() ? localStorage.getItem('token') : null);
  readonly isLoadingUsers = this.loadingUsers.asReadonly();
  readonly currentAdmin = this.currentAdminSignal.asReadonly();
  readonly currentAcademy = this.currentAcademySignal.asReadonly();

  constructor(private iamApi: IamApi) {
    this.isSignedInSignal.set(false);
    this.currentEmailSignal.set(null);
    this.currentUserIdSignal.set(null);
  }

  signIn(signInCommand: SignInCommand, router: Router) {
    this.signInError.set(null);
    this.loadingUsers.set(true);
    this.iamApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        localStorage.setItem('token', signInResource.token);
        this.isSignedInSignal.set(true);
        this.currentEmailSignal.set(signInResource.emailAddress);
        this.currentUserIdSignal.set(signInResource.id);
        this.loadingUsers.set(false);
        router.navigate(['/home']).then();
      },
      error: (err) => {
        this.signInError.set(err?.error?.message || err?.message || 'An unexpected error occurred');
        this.isSignedInSignal.set(false);
        this.currentEmailSignal.set(null);
        this.currentUserIdSignal.set(null);
        this.loadingUsers.set(false);
      }
    });
  }

  signUp(signUpCommand: SignUpCommand, router: Router) {
    this.signUpError.set(null);
    this.loadingUsers.set(true);
    this.iamApi.signUp(signUpCommand).subscribe({
      next: (signUpResource) => {
        localStorage.setItem('userId', signUpResource.id.toString());
        this.loadingUsers.set(false);
        router.navigate(['/verify-account'], {
          queryParams: { email: signUpCommand.emailAddress }
        }).then();
      },
      error: (err) => {
        this.signUpError.set(err?.error?.message || err?.message || 'An unexpected error occurred');
        this.loadingUsers.set(false);
      }
    });
  }

  verify(request: VerifyRequest, router: Router) {
    this.verifyError.set(null);
    this.loadingUsers.set(true);
    this.iamApi.verify(request).subscribe({
      next: (verifyResource) => {
        localStorage.setItem('token', verifyResource.token);
        this.isSignedInSignal.set(true);
        this.currentEmailSignal.set(verifyResource.email);
        this.currentUserIdSignal.set(verifyResource.id);
        this.loadingUsers.set(false);
        router.navigate(['/complete-account']).then();
      },
      error: (err) => {
        this.verifyError.set(err?.error?.message || err?.message || 'An unexpected error occurred');
        this.loadingUsers.set(false);
      }
    });
  }

  resendCode(email: string): Observable<{message: string}> {
    return this.iamApi.resendCode(email);
  }

  completeAccount(request: AdminRegisterRequest, router: Router) {
    this.completeAccountError.set(null);
    this.loadingUsers.set(true);
    this.iamApi.registerAdmin(request).subscribe({
      next: (adminResource) => {
        localStorage.setItem('adminId', adminResource.id.toString());
        this.currentAdminSignal.set(new Admin({
          id: adminResource.id,
          firstName: adminResource.firstName,
          lastName: adminResource.lastName
        }));
        this.loadingUsers.set(false);
        router.navigate(['/setup-academy']).then();
      },
      error: (err) => {
        this.completeAccountError.set(err?.error?.message || err?.message || 'An unexpected error occurred');
        this.loadingUsers.set(false);
      }
    });
  }

  setupAcademy(request: AcademyRegisterRequest, router: Router) {
    this.setupAcademyError.set(null);
    this.loadingUsers.set(true);
    this.iamApi.registerAcademy(request).subscribe({
      next: (academyResource) => {
        localStorage.setItem('academyId', academyResource.id.toString());
        this.currentAcademySignal.set(new Academy({
          id: academyResource.id,
          name: academyResource.academyName,
          description: academyResource.academyDescription
        }));
        this.loadingUsers.set(false);
        router.navigate(['/home']).then();
      },
      error: (err) => {
        this.setupAcademyError.set(err?.error?.message || err?.message || 'An unexpected error occurred');
        this.loadingUsers.set(false);
      }
    });
  }

  requestResetPassword(request: RequestResetPasswordRequest) {
    this.resetPasswordLoading.set(true);
    this.resetPasswordError.set(null);
    this.iamApi.requestResetPassword(request).subscribe({
      next: () => {
        this.resetPasswordLoading.set(false);
        this.resetPasswordSuccess.set('If the email is registered, a reset code has been sent.');
      },
      error: (err) => {
        this.resetPasswordError.set(err?.error?.message || err?.message || 'An unexpected error occurred');
        this.resetPasswordLoading.set(false);
      }
    });
  }

  verifyResetCode(request: VerifyResetCodeRequest) {
    this.resetPasswordLoading.set(true);
    this.resetPasswordError.set(null);
    this.iamApi.verifyResetCode(request).subscribe({
      next: () => {
        this.resetPasswordLoading.set(false);
        this.resetPasswordSuccess.set('Code verified successfully.');
      },
      error: (err) => {
        this.resetPasswordError.set(err?.error?.message || err?.message || 'An unexpected error occurred');
        this.resetPasswordLoading.set(false);
      }
    });
  }

  resetPassword(request: ResetPasswordRequest, router: Router) {
    this.resetPasswordLoading.set(true);
    this.resetPasswordError.set(null);
    this.iamApi.resetPassword(request).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.isSignedInSignal.set(true);
        this.currentEmailSignal.set(response.emailAddress);
        this.currentUserIdSignal.set(response.id);
        this.resetPasswordLoading.set(false);
        router.navigate(['/home']).then();
      },
      error: (err) => {
        this.resetPasswordError.set(err?.error?.message || err?.message || 'An unexpected error occurred');
        this.resetPasswordLoading.set(false);
      }
    });
  }

  clearResetPasswordState() {
    this.resetPasswordError.set(null);
    this.resetPasswordSuccess.set(null);
    this.resetPasswordLoading.set(false);
  }

  signOut(router: Router) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('adminId');
    localStorage.removeItem('academyId');
    this.isSignedInSignal.set(false);
    this.currentEmailSignal.set(null);
    this.currentUserIdSignal.set(null);
    this.currentAdminSignal.set(null);
    this.currentAcademySignal.set(null);
    this.signInError.set(null);
    this.signUpError.set(null);
    this.verifyError.set(null);
    this.completeAccountError.set(null);
    this.setupAcademyError.set(null);
    this.resetPasswordError.set(null);
    this.resetPasswordSuccess.set(null);
    this.resetPasswordLoading.set(false);
    this.loadingUsers.set(false);
    router.navigate(['/sign-up']).then();
  }
}
