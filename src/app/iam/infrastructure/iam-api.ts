import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {HttpClient} from '@angular/common/http';
import {SignUpAssembler} from './sign-up-assembler';
import {SignInAssembler} from './sign-in-assembler';
import {SignUpCommand} from '../domain/model/sign-up.command';
import {Observable} from 'rxjs';
import {SignUpResource} from './sign-up-response';
import {SignInCommand} from '../domain/model/sign-in.command';
import {SignInResource} from './sign-in-response';
import {SignUpApiEndpoint} from './sign-up-endpoint';
import {SignInApiEndpoint} from './sign-in-endpoint';
import {VerifyApiEndpoint} from './verify-endpoint';
import {VerifyRequest} from './verify-request';
import {VerifyResource} from './verify-response';
import {AdminRegisterApiEndpoint} from './admin-register-endpoint';
import {AdminRegisterRequest} from './admin-register-request';
import {AdminRegisterResource} from './admin-register-response';
import {AcademyRegisterApiEndpoint} from './academy-register-endpoint';
import {AcademyRegisterRequest} from './academy-register-request';
import {AcademyRegisterResource} from './academy-register-response';
import {ResetPasswordApiEndpoint} from './reset-password-endpoint';
import {RequestResetPasswordRequest} from './request-reset-password-request';
import {VerifyResetCodeRequest} from './verify-reset-code-request';
import {ResetPasswordRequest} from './reset-password-request';
import {ResetPasswordResource} from './reset-password-response';
import {MessageResource} from './message-resource';

@Injectable({providedIn: 'root'})
export class IamApi extends BaseApi {
  private readonly signUpEndpoint: SignUpApiEndpoint;
  private readonly signInEndpoint: SignInApiEndpoint;
  private readonly verifyEndpoint: VerifyApiEndpoint;
  private readonly adminRegisterEndpoint: AdminRegisterApiEndpoint;
  private readonly academyRegisterEndpoint: AcademyRegisterApiEndpoint;
  private readonly resetPasswordEndpoint: ResetPasswordApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.signUpEndpoint = new SignUpApiEndpoint(http, new SignUpAssembler());
    this.signInEndpoint = new SignInApiEndpoint(http, new SignInAssembler());
    this.verifyEndpoint = new VerifyApiEndpoint(http);
    this.adminRegisterEndpoint = new AdminRegisterApiEndpoint(http);
    this.academyRegisterEndpoint = new AcademyRegisterApiEndpoint(http);
    this.resetPasswordEndpoint = new ResetPasswordApiEndpoint(http);
  }

  signUp(signUpCommand: SignUpCommand): Observable<SignUpResource> {
    return this.signUpEndpoint.signUp(signUpCommand);
  }

  signIn(signInCommand: SignInCommand): Observable<SignInResource> {
    return this.signInEndpoint.signIn(signInCommand);
  }

  verify(request: VerifyRequest): Observable<VerifyResource> {
    return this.verifyEndpoint.verify(request);
  }

  resendCode(email: string): Observable<{message: string}> {
    return this.verifyEndpoint.resendCode(email);
  }

  registerAdmin(request: AdminRegisterRequest): Observable<AdminRegisterResource> {
    return this.adminRegisterEndpoint.register(request);
  }

  registerAcademy(request: AcademyRegisterRequest): Observable<AcademyRegisterResource> {
    return this.academyRegisterEndpoint.register(request);
  }

  requestResetPassword(request: RequestResetPasswordRequest): Observable<MessageResource> {
    return this.resetPasswordEndpoint.requestResetPassword(request);
  }

  verifyResetCode(request: VerifyResetCodeRequest): Observable<MessageResource> {
    return this.resetPasswordEndpoint.verifyResetCode(request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordResource> {
    return this.resetPasswordEndpoint.resetPassword(request);
  }
}