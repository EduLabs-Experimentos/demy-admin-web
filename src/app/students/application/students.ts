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

  clearError() {
    this.errorSignal.set(null);
  }

  addStudent(student: Student, onSuccess?: () => void): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.studentsApi.createStudent(student).pipe(retry(2)).subscribe({
      next: createdStudent => {
        this.studentsSignal.update(students => [...students, createdStudent]);
        this.loadingSignal.set(false);
        if (onSuccess) onSuccess();
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
    const status = error?.status;
    const errorMessage = error?.message || '';
    const backendMessage = error?.error?.message || '';

    const fullMessage = errorMessage + ' ' + backendMessage;
    const msgLower = fullMessage.toLowerCase();

    if (status === 400 || msgLower.includes('400')) {
      if (msgLower.includes('email') || msgLower.includes('correo') || msgLower.includes('mail')) {
        return 'El email ingresado es inválido. Verifica el formato (ej: correo@ejemplo.com).';
      }
      if (msgLower.includes('phone') || msgLower.includes('telefono') || msgLower.includes('teléfono') || msgLower.includes('telefon') || msgLower.includes('móvil') || msgLower.includes('mobile')) {
        return 'El teléfono debe tener 9 dígitos.';
      }
      if (msgLower.includes('dni')) {
        return 'El DNI debe tener 8 dígitos.';
      }
      if (msgLower.includes('name') || msgLower.includes('nombre') || msgLower.includes('lastname') || msgLower.includes('last')) {
        return 'El nombre o apellido contiene caracteres inválidos.';
      }
      if (backendMessage && backendMessage.trim() && !backendMessage.includes('Server returned')) {
        return backendMessage;
      }
      if (errorMessage && errorMessage.trim() && !errorMessage.includes('Server returned')) {
        return errorMessage;
      }
      return 'Los datos ingresados son inválidos. Por favor verifica la información.';
    }

    if (error instanceof Error) {
      if (error.message.includes('Resource not found')) return `${fallback}: Not found`;
      if (error.message.includes('Server returned code') && !backendMessage) return fallback;
      return error.message;
    }

    if (backendMessage && !backendMessage.includes('Server returned code')) {
      return backendMessage;
    }

    return fallback;
  }
}
