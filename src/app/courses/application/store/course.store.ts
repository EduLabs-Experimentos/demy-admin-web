import {Injectable, signal} from '@angular/core';
import {Course} from '../../domain/model/course.entity';
import {CourseFormData} from '../../domain/model/course-form-data';
import {GetCoursesService} from '../services/get-courses.service';
import {CreateCourseService} from '../services/create-course.service';
import {UpdateCourseService} from '../services/update-course.service';
import {DeleteCourseService} from '../services/delete-course.service';
import {CreateCourseRequest, UpdateCourseRequest} from '../../infrastructure/course-request';

@Injectable({providedIn: 'root'})
export class CourseStore {
  private readonly coursesSignal = signal<Course[]>([]);
  private readonly filteredCoursesSignal = signal<Course[]>([]);
  private readonly isLoadingCoursesSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly isDeletingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly formDataSignal = signal<CourseFormData>({
    name: '',
    code: '',
    description: ''
  });
  private readonly searchQuerySignal = signal<string>('');
  private readonly selectedCourseIdSignal = signal<number | null>(null);

  readonly courses = this.coursesSignal.asReadonly();
  readonly filteredCourses = this.filteredCoursesSignal.asReadonly();
  readonly isLoadingCourses = this.isLoadingCoursesSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isDeleting = this.isDeletingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly formData = this.formDataSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly selectedCourseId = this.selectedCourseIdSignal.asReadonly();
  readonly isEditing = () => this.selectedCourseIdSignal() !== null;

  constructor(
    private readonly getCoursesService: GetCoursesService,
    private readonly createCourseService: CreateCourseService,
    private readonly updateCourseService: UpdateCourseService,
    private readonly deleteCourseService: DeleteCourseService
  ) {}

  loadCourses(): void {
    this.isLoadingCoursesSignal.set(true);
    this.getCoursesService.execute().subscribe({
      next: (courses) => {
        this.coursesSignal.set(courses);
        this.applyFilter(this.searchQuerySignal());
        this.isLoadingCoursesSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load courses');
        this.isLoadingCoursesSignal.set(false);
      }
    });
  }

  createCourse(): void {
    const formData = this.formDataSignal();

    if (!formData.name && !formData.code) {
      this.errorSignal.set('Name and code are required');
      return;
    }

    if (!formData.name) {
      this.errorSignal.set('Name is required');
      return;
    }

    if (!formData.code) {
      this.errorSignal.set('Code is required');
      return;
    }

    if (!formData.description?.trim()) {
      this.errorSignal.set('Description is required');
      return;
    }

    if (!this.isValidName(formData.name)) {
      this.errorSignal.set('Please enter a valid course name (2-50 letters and spaces only)');
      return;
    }

    if (!this.isValidCode(formData.code)) {
      this.errorSignal.set('Please enter a valid course code (2-10 uppercase letters and numbers only)');
      return;
    }

    const request: CreateCourseRequest = {
      name: formData.name,
      code: formData.code,
      description: formData.description
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.createCourseService.execute(request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadCourses();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to create course');
        this.isLoadingSignal.set(false);
      }
    });
  }

  updateCourse(): void {
    const courseId = this.selectedCourseIdSignal();
    const formData = this.formDataSignal();

    if (!courseId) {
      this.errorSignal.set('No course selected for update');
      return;
    }

    if (!formData.name && !formData.code) {
      this.errorSignal.set('Name and code are required');
      return;
    }

    if (!formData.name) {
      this.errorSignal.set('Name is required');
      return;
    }

    if (!formData.code) {
      this.errorSignal.set('Code is required');
      return;
    }

    if (!formData.description?.trim()) {
      this.errorSignal.set('Description is required');
      return;
    }

    if (!this.isValidName(formData.name)) {
      this.errorSignal.set('Please enter a valid course name (2-50 letters and spaces only)');
      return;
    }

    if (!this.isValidCode(formData.code)) {
      this.errorSignal.set('Please enter a valid course code (2-10 uppercase letters and numbers only)');
      return;
    }

    const request: UpdateCourseRequest = {
      name: formData.name,
      code: formData.code,
      description: formData.description
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.updateCourseService.execute(courseId, request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadCourses();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to update course');
        this.isLoadingSignal.set(false);
      }
    });
  }

  deleteCourse(courseId: number): void {
    this.isDeletingSignal.set(true);
    this.errorSignal.set(null);
    this.deleteCourseService.execute(courseId).subscribe({
      next: () => {
        this.isDeletingSignal.set(false);
        if (this.selectedCourseIdSignal() === courseId) {
          this.resetForm();
        }
        this.loadCourses();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to delete course');
        this.isDeletingSignal.set(false);
      }
    });
  }

  editCourse(course: Course): void {
    this.selectedCourseIdSignal.set(course.id);
    this.formDataSignal.set({
      name: course.name,
      code: course.code,
      description: course.description
    });
    this.errorSignal.set(null);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  onFieldChange(field: keyof CourseFormData, value: string): void {
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
      name: '',
      code: '',
      description: ''
    });
    this.selectedCourseIdSignal.set(null);
  }

  private applyFilter(query: string): void {
    const courses = this.coursesSignal();
    const filtered = query.trim()
      ? courses.filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()))
      : courses;
    this.filteredCoursesSignal.set(filtered);
  }

  private isValidName(name: string): boolean {
    if (!name) return false;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(name.trim());
  }

  private isValidCode(code: string): boolean {
    if (!code) return false;
    return /^[A-Z0-9]{2,10}$/.test(code.trim());
  }
}
