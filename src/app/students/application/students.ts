import { computed, Injectable, Signal, signal } from '@angular/core';
import { Student } from '../domain/model/student.entity';
import { StudentsApi } from '../infrastructure/students-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentsStore {
  private readonly studentsSignal = signal<Student[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly students = this.studentsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly studentCount = computed(() => this.students().length);

  constructor(private studentsApi: StudentsApi) {
    this.loadStudents();
  }

  getStudentById(id: number | null | undefined): Signal<Student | undefined> {
    return computed(() => id ? this.students().find(s => s.id === id) : undefined);
  }

  // NUEVO: Metodo para limpiar errores manualmente
  clearError() {
    this.errorSignal.set(null);
  }

  // MODIFICADO: Agregamos onSuccess para que el formulario sepa cuándo borrarse
  addStudent(student: Student, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.studentsApi.createStudent(student).pipe(retry(2)).subscribe({
      next: createdStudent => {
        this.studentsSignal.update(students => [...students, createdStudent]);
        this.loadingSignal.set(false);
        if (onSuccess) onSuccess(); // Solo limpiamos si hay éxito
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create student'));
        this.loadingSignal.set(false);
      }
    });
  }

  // MODIFICADO: Agregamos onSuccess
  updateStudent(updatedStudent: Student, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.studentsApi.updateStudent(updatedStudent).pipe(retry(2)).subscribe({
      next: student => {
        this.studentsSignal.update(students =>
          students.map(s => s.id === student.id ? student : s)
        );
        this.loadingSignal.set(false);
        if (onSuccess) onSuccess(); // Solo limpiamos si hay éxito
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update student'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteStudent(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.studentsApi.deleteStudent(id).pipe(retry(2)).subscribe({
      next: () => {
        this.studentsSignal.update(students => students.filter(s => s.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete student'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadStudents(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.studentsApi.getStudents().pipe(takeUntilDestroyed()).subscribe({
      next: students => {
        this.studentsSignal.set(students);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load students'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
