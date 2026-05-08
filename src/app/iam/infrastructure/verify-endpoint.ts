import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {VerifyRequest} from './verify-request';
import {VerifyResponse, VerifyResource} from './verify-response';
import {environment} from '../../../environments/environment.development';

const authApiBaseUrl = environment.platformProviderApiBaseUrl + environment.platformProviderVerifyEndpointPath;

/**
 * API endpoint for verifying user account.
 */
export class VerifyApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  verify(request: VerifyRequest): Observable<VerifyResource> {
    return this.http.post<VerifyResponse>(authApiBaseUrl, request).pipe(
      map(response => ({
        id: response.id,
        email: response.email,
        token: response.token,
        roles: response.roles,
      } as VerifyResource)),
      catchError(this.handleError('Failed to verify account'))
    );
  }

  resendCode(email: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(environment.platformProviderApiBaseUrl + environment.platformProviderResendCodeEndpointPath, { email }).pipe(
      catchError(this.handleError('Failed to resend code'))
    );
  }
}