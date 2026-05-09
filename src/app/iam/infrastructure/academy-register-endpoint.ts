import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {AcademyRegisterRequest} from './academy-register-request';
import {AcademyRegisterResource, AcademyRegisterResponse} from './academy-register-response';
import {environment} from '../../../environments/environment.development';

const academyApiBaseUrl = environment.platformProviderApiBaseUrl + environment.platformProviderAcademyRegisterEndpointPath;

export class AcademyRegisterApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  register(request: AcademyRegisterRequest): Observable<AcademyRegisterResource> {
    return this.http.post<AcademyRegisterResponse>(academyApiBaseUrl, request).pipe(
      map(response => ({
        id: response.id,
        administratorId: response.administratorId,
        academyName: response.academyName,
        academyDescription: response.academyDescription,
        street: response.street,
        district: response.district,
        province: response.province,
        department: response.department,
        emailAddress: response.emailAddress,
        phoneNumber: response.phoneNumber,
        ruc: response.ruc,
      } as AcademyRegisterResource)),
      catchError(this.handleError('Failed to register academy'))
    );
  }
}
