import { computed, Injectable, Signal, signal } from '@angular/core';
import { Student } from '../domain/model/student.entity';
import { StudentsApi } from '../infrastructure/students-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

/**
 * State management store for students using Angular signals.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentsStore {
  // --- Estado Global (Signals Privados) ---
  private readonly studentsSignal = signal<Student[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // --- Estado de Solo Lectura (Expuesto a los componentes) ---
  readonly students = this.studentsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // --- Propiedades Computadas ---
  readonly studentCount = computed(() => this.students().length);

  constructor(private studentsApi: StudentsApi) {
    // Al inyectar el store, cargamos los estudiantes iniciales
    this.loadStudents();
  }

  /**
   * Obtiene un estudiante específico por su ID.
   */
  getStudentById(id: number | null | undefined): Signal<Student | undefined> {
    return computed(() => id ? this.students().find(s => s.id === id) : undefined);
  }

  /**
   * Agrega un nuevo estudiante al backend y actualiza el estado local.
   */
  addStudent(student: Student): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.studentsApi.createStudent(student).pipe(retry(2)).subscribe({
      next: createdStudent => {
        this.studentsSignal.update(students => [...students, createdStudent]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create student'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Actualiza los datos de un estudiante en el backend y en el estado local.
   */
  updateStudent(updatedStudent: Student): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.studentsApi.updateStudent(updatedStudent).pipe(retry(2)).subscribe({
      next: student => {
        this.studentsSignal.update(students =>
          students.map(s => s.id === student.id ? student : s)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update student'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Elimina un estudiante por ID en el backend y actualiza el estado local.
   */
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

  /**
   * Carga la lista inicial de estudiantes.
   * Usa takeUntilDestroyed para evitar memory leaks si el servicio se destruye.
   */
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

  /**
   * Formatea el mensaje de error para la vista.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
