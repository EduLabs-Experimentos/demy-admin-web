import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { StudentsApiEndpoint } from './students-api-endpoint';
import { Observable } from 'rxjs';
import { Student } from '../domain/model/student.entity';

@Injectable({ providedIn: 'root' })
export class StudentsApi extends BaseApi {
  private readonly studentsEndpoint: StudentsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.studentsEndpoint = new StudentsApiEndpoint(http);
  }

  getStudents(): Observable<Student[]> {
    return this.studentsEndpoint.getAll();
  }

  getStudentById(id: number): Observable<Student> {
    return this.studentsEndpoint.getById(id);
  }

  createStudent(student: Student): Observable<Student> {
    return this.studentsEndpoint.create(student);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.studentsEndpoint.update(student, student.id);
  }

  deleteStudent(id: number): Observable<void> {
    return this.studentsEndpoint.delete(id);
  }
}
