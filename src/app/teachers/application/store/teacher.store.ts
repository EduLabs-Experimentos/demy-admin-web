import {Injectable, signal} from '@angular/core';
import {Teacher} from '../../domain/model/teacher.entity';
import {TeacherFormData} from '../../domain/model/teacher-form-data';
import {GetTeachersService} from '../services/get-teachers.service';
import {RegisterTeacherService} from '../services/register-teacher.service';
import {CreateTeacherRequest} from '../../infrastructure/teacher-request';

@Injectable({providedIn: 'root'})
export class TeacherStore {
  private readonly teachersSignal = signal<Teacher[]>([]);
  private readonly filteredTeachersSignal = signal<Teacher[]>([]);
  private readonly isLoadingTeachersSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly formDataSignal = signal<TeacherFormData>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    countryCode: '+51',
    phone: ''
  });
  private readonly searchQuerySignal = signal<string>('');

  readonly teachers = this.teachersSignal.asReadonly();
  readonly filteredTeachers = this.filteredTeachersSignal.asReadonly();
  readonly isLoadingTeachers = this.isLoadingTeachersSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly formData = this.formDataSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();

  constructor(
    private readonly getTeachersService: GetTeachersService,
    private readonly registerTeacherService: RegisterTeacherService
  ) {}

  loadTeachers(): void {
    this.isLoadingTeachersSignal.set(true);
    this.getTeachersService.execute().subscribe({
      next: (teachers) => {
        this.teachersSignal.set(teachers);
        this.applyFilter(this.searchQuerySignal());
        this.isLoadingTeachersSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load teachers');
        this.isLoadingTeachersSignal.set(false);
      }
    });
  }

  registerTeacher(): void {
    const formData = this.formDataSignal();

    if (!formData.firstName || !formData.lastName || !formData.emailAddress) {
      this.errorSignal.set('El nombre, apellido y email son requeridos');
      return;
    }

    const request: CreateTeacherRequest = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailAddress: formData.emailAddress,
      countryCode: formData.countryCode,
      phone: formData.phone
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.registerTeacherService.execute(request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadTeachers();
      },
      error: (err) => {
        this.errorSignal.set(this.extractError(err));
        this.isLoadingSignal.set(false);
      }
    });
  }

  private extractError(err: any): string {
    const status = err?.status;
    const errorMessage = err?.message || '';
    const backendMessage = err?.error?.message || '';

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
        return 'El DNI es inválido.';
      }
      if (msgLower.includes('ruc')) {
        return 'El RUC es inválido.';
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

    if (backendMessage && !backendMessage.includes('Server returned code')) {
      return backendMessage;
    }

    if (errorMessage && !errorMessage.includes('Server returned code')) {
      return errorMessage;
    }

    return 'Error al registrar el profesor. Por favor intenta de nuevo.';
  }

  onFieldChange(field: keyof TeacherFormData, value: string): void {
    this.formDataSignal.update(data => ({ ...data, [field]: value }));
  }

  onSearchQueryChange(query: string): void {
    this.searchQuerySignal.set(query);
    this.applyFilter(query);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private resetForm(): void {
    this.formDataSignal.set({
      firstName: '',
      lastName: '',
      emailAddress: '',
      countryCode: '+51',
      phone: ''
    });
  }

  private applyFilter(query: string): void {
    const teachers = this.teachersSignal();
    const filtered = query.trim()
      ? teachers.filter(t =>
          t.firstName.toLowerCase().includes(query.toLowerCase()) ||
          t.lastName.toLowerCase().includes(query.toLowerCase()) ||
          t.emailAddress.toLowerCase().includes(query.toLowerCase()))
      : teachers;
    this.filteredTeachersSignal.set(filtered);
  }
}
