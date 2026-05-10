import {Injectable, signal} from '@angular/core';
import {Classroom} from '../../domain/model/classroom.entity';
import {ClassroomFormData} from '../../domain/model/classroom-form-data';
import {GetClassroomsService} from '../services/get-classrooms.service';
import {CreateClassroomService} from '../services/create-classroom.service';
import {UpdateClassroomService} from '../services/update-classroom.service';
import {DeleteClassroomService} from '../services/delete-classroom.service';
import {CreateClassroomRequest, UpdateClassroomRequest} from '../../infrastructure/classroom-request';

@Injectable({providedIn: 'root'})
export class ClassroomStore {
  private readonly classroomsSignal = signal<Classroom[]>([]);
  private readonly filteredClassroomsSignal = signal<Classroom[]>([]);
  private readonly isLoadingClassroomsSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly isDeletingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly formDataSignal = signal<ClassroomFormData>({
    code: '',
    capacity: '',
    campus: ''
  });
  private readonly searchQuerySignal = signal<string>('');
  private readonly selectedClassroomIdSignal = signal<number | null>(null);

  readonly classrooms = this.classroomsSignal.asReadonly();
  readonly filteredClassrooms = this.filteredClassroomsSignal.asReadonly();
  readonly isLoadingClassrooms = this.isLoadingClassroomsSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isDeleting = this.isDeletingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly formData = this.formDataSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly selectedClassroomId = this.selectedClassroomIdSignal.asReadonly();
  readonly isEditing = () => this.selectedClassroomIdSignal() !== null;

  constructor(
    private readonly getClassroomsService: GetClassroomsService,
    private readonly createClassroomService: CreateClassroomService,
    private readonly updateClassroomService: UpdateClassroomService,
    private readonly deleteClassroomService: DeleteClassroomService
  ) {}

  loadClassrooms(): void {
    this.isLoadingClassroomsSignal.set(true);
    this.getClassroomsService.execute().subscribe({
      next: (classrooms) => {
        this.classroomsSignal.set(classrooms);
        this.applyFilter(this.searchQuerySignal());
        this.isLoadingClassroomsSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load classrooms');
        this.isLoadingClassroomsSignal.set(false);
      }
    });
  }

  createClassroom(): void {
    const formData = this.formDataSignal();

    if (!formData.code && !formData.capacity) {
      this.errorSignal.set('Code and capacity are required');
      return;
    }

    if (!formData.code) {
      this.errorSignal.set('Code is required');
      return;
    }

    if (!formData.capacity) {
      this.errorSignal.set('Capacity is required');
      return;
    }

    if (!formData.campus?.trim()) {
      this.errorSignal.set('Campus is required');
      return;
    }

    if (!this.isValidCode(formData.code)) {
      this.errorSignal.set('Please enter a valid classroom code (2-10 uppercase letters and numbers only)');
      return;
    }

    if (!this.isValidCapacity(formData.capacity)) {
      this.errorSignal.set('Capacity must be a number between 1 and 999');
      return;
    }

    const request: CreateClassroomRequest = {
      code: formData.code,
      capacity: Number(formData.capacity),
      campus: formData.campus
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.createClassroomService.execute(request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadClassrooms();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to create classroom');
        this.isLoadingSignal.set(false);
      }
    });
  }

  updateClassroom(): void {
    const classroomId = this.selectedClassroomIdSignal();
    const formData = this.formDataSignal();

    if (!classroomId) {
      this.errorSignal.set('No classroom selected for update');
      return;
    }

    if (!formData.code && !formData.capacity) {
      this.errorSignal.set('Code and capacity are required');
      return;
    }

    if (!formData.code) {
      this.errorSignal.set('Code is required');
      return;
    }

    if (!formData.capacity) {
      this.errorSignal.set('Capacity is required');
      return;
    }

    if (!formData.campus?.trim()) {
      this.errorSignal.set('Campus is required');
      return;
    }

    if (!this.isValidCode(formData.code)) {
      this.errorSignal.set('Please enter a valid classroom code (2-10 uppercase letters and numbers only)');
      return;
    }

    if (!this.isValidCapacity(formData.capacity)) {
      this.errorSignal.set('Capacity must be a number between 1 and 999');
      return;
    }

    const request: UpdateClassroomRequest = {
      code: formData.code,
      capacity: Number(formData.capacity),
      campus: formData.campus
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.updateClassroomService.execute(classroomId, request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadClassrooms();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to update classroom');
        this.isLoadingSignal.set(false);
      }
    });
  }

  deleteClassroom(classroomId: number): void {
    this.isDeletingSignal.set(true);
    this.errorSignal.set(null);
    this.deleteClassroomService.execute(classroomId).subscribe({
      next: () => {
        this.isDeletingSignal.set(false);
        if (this.selectedClassroomIdSignal() === classroomId) {
          this.resetForm();
        }
        this.loadClassrooms();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to delete classroom');
        this.isDeletingSignal.set(false);
      }
    });
  }

  editClassroom(classroom: Classroom): void {
    this.selectedClassroomIdSignal.set(classroom.id);
    this.formDataSignal.set({
      code: classroom.code,
      capacity: String(classroom.capacity),
      campus: classroom.campus
    });
    this.errorSignal.set(null);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  onFieldChange(field: keyof ClassroomFormData, value: string): void {
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
      code: '',
      capacity: '',
      campus: ''
    });
    this.selectedClassroomIdSignal.set(null);
  }

  private applyFilter(query: string): void {
    const classrooms = this.classroomsSignal();
    const filtered = query.trim()
      ? classrooms.filter(c =>
          c.code.toLowerCase().includes(query.toLowerCase()) ||
          c.campus.toLowerCase().includes(query.toLowerCase()))
      : classrooms;
    this.filteredClassroomsSignal.set(filtered);
  }

  private isValidCode(code: string): boolean {
    if (!code) return false;
    return /^[A-Z0-9]{2,10}$/.test(code.trim());
  }

  private isValidCapacity(capacity: string): boolean {
    const num = Number(capacity);
    return !isNaN(num) && num >= 1 && num <= 999 && Number.isInteger(num);
  }
}
