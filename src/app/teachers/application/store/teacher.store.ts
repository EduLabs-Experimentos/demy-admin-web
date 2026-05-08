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
      this.errorSignal.set('First name, last name and email are required');
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
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to register teacher');
        this.isLoadingSignal.set(false);
      }
    });
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
