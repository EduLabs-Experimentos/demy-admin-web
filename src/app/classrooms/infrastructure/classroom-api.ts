import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ClassroomEndpoint} from './classroom-endpoint';
import {CreateClassroomRequest, UpdateClassroomRequest} from './classroom-request';
import {ClassroomResource} from './classroom-response';

@Injectable({providedIn: 'root'})
export class ClassroomApi {
  private readonly endpoint: ClassroomEndpoint;

  constructor(http: HttpClient) {
    this.endpoint = new ClassroomEndpoint(http);
  }

  getAll(): Observable<ClassroomResource[]> {
    return this.endpoint.getAll();
  }

  getById(classroomId: number): Observable<ClassroomResource> {
    return this.endpoint.getById(classroomId);
  }

  create(request: CreateClassroomRequest): Observable<ClassroomResource> {
    return this.endpoint.create(request);
  }

  update(classroomId: number, request: UpdateClassroomRequest): Observable<ClassroomResource> {
    return this.endpoint.update(classroomId, request);
  }

  delete(classroomId: number): Observable<void> {
    return this.endpoint.delete(classroomId);
  }
}
