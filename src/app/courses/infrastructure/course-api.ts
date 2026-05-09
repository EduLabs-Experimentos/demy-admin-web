import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CourseEndpoint} from './course-endpoint';
import {CreateCourseRequest, UpdateCourseRequest} from './course-request';
import {CourseResource} from './course-response';

@Injectable({providedIn: 'root'})
export class CourseApi {
  private readonly endpoint: CourseEndpoint;

  constructor(http: HttpClient) {
    this.endpoint = new CourseEndpoint(http);
  }

  getAll(): Observable<CourseResource[]> {
    return this.endpoint.getAll();
  }

  getById(courseId: number): Observable<CourseResource> {
    return this.endpoint.getById(courseId);
  }

  create(request: CreateCourseRequest): Observable<CourseResource> {
    return this.endpoint.create(request);
  }

  update(courseId: number, request: UpdateCourseRequest): Observable<CourseResource> {
    return this.endpoint.update(courseId, request);
  }

  delete(courseId: number): Observable<void> {
    return this.endpoint.delete(courseId);
  }
}
