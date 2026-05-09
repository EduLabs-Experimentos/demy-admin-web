import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TeacherEndpoint} from './teacher-endpoint';
import {CreateTeacherRequest} from './teacher-request';
import {TeacherResource} from './teacher-response';

@Injectable({providedIn: 'root'})
export class TeacherApi {
  private readonly endpoint: TeacherEndpoint;

  constructor(http: HttpClient) {
    this.endpoint = new TeacherEndpoint(http);
  }

  getAll(): Observable<TeacherResource[]> {
    return this.endpoint.getAll();
  }

  create(request: CreateTeacherRequest): Observable<TeacherResource> {
    return this.endpoint.create(request);
  }
}
