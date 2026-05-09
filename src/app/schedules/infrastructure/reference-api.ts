import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReferenceEndpoint} from './reference-endpoint';
import {ScheduleCourseResource, ScheduleClassroomResource, ScheduleTeacherResource} from './schedule-response';

@Injectable({providedIn: 'root'})
export class ReferenceApi {
  private readonly endpoint: ReferenceEndpoint;

  constructor(http: HttpClient) {
    this.endpoint = new ReferenceEndpoint(http);
  }

  getCourses(): Observable<ScheduleCourseResource[]> {
    return this.endpoint.getCourses();
  }

  getClassrooms(): Observable<ScheduleClassroomResource[]> {
    return this.endpoint.getClassrooms();
  }

  getTeachers(): Observable<ScheduleTeacherResource[]> {
    return this.endpoint.getTeachers();
  }
}
