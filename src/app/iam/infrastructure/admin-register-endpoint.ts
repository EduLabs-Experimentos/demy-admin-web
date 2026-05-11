import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {AdminRegisterRequest} from './admin-register-request';
import {AdminRegisterResource, AdminRegisterResponse} from './admin-register-response';
import {environment} from '../../../environments/environment';

const adminApiBaseUrl = environment.platformProviderApiBaseUrl + environment.platformProviderAdminRegisterEndpointPath;

export class AdminRegisterApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  register(request: AdminRegisterRequest): Observable<AdminRegisterResource> {
    return this.http.post<AdminRegisterResponse>(adminApiBaseUrl, request).pipe(
      map(response => ({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        phoneNumber: response.phoneNumber,
        dniNumber: response.dniNumber,
        academyId: response.academyId,
        userId: response.userId,
      } as AdminRegisterResource)),
      catchError(this.handleError('Failed to register administrator'))
    );
  }
}
