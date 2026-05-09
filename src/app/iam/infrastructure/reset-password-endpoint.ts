import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {RequestResetPasswordRequest} from './request-reset-password-request';
import {VerifyResetCodeRequest} from './verify-reset-code-request';
import {ResetPasswordRequest} from './reset-password-request';
import {ResetPasswordResource, ResetPasswordResponse} from './reset-password-response';
import {MessageResource} from './message-resource';
import {environment} from '../../../environments/environment.development';

const authBaseUrl = environment.platformProviderApiBaseUrl;

export class ResetPasswordApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  requestResetPassword(request: RequestResetPasswordRequest): Observable<MessageResource> {
    return this.http.post<MessageResource>(
      `${authBaseUrl}${environment.platformProviderRequestResetPasswordEndpointPath}`,
      request
    ).pipe(catchError(this.handleError('Failed to request password reset')));
  }

  verifyResetCode(request: VerifyResetCodeRequest): Observable<MessageResource> {
    return this.http.post<MessageResource>(
      `${authBaseUrl}${environment.platformProviderVerifyResetCodeEndpointPath}`,
      request
    ).pipe(catchError(this.handleError('Failed to verify reset code')));
  }

  resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordResource> {
    return this.http.post<ResetPasswordResponse>(
      `${authBaseUrl}${environment.platformProviderResetPasswordEndpointPath}`,
      request
    ).pipe(
      map(response => ({
        id: response.id,
        emailAddress: response.emailAddress,
        token: response.token,
      } as ResetPasswordResource)),
      catchError(this.handleError('Failed to reset password'))
    );
  }
}
