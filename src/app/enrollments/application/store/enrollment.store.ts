import {Injectable, signal} from '@angular/core';
import {Enrollment} from '../../domain/model/enrollment.entity';
import {EnrollmentFormData} from '../../domain/model/enrollment-form-data';
import {GetEnrollmentsService} from '../services/get-enrollments.service';
import {CreateEnrollmentService} from '../services/create-enrollment.service';
import {UpdateEnrollmentService} from '../services/update-enrollment.service';
import {DeleteEnrollmentService} from '../services/delete-enrollment.service';
import {EnrollmentReferenceApi} from '../../infrastructure/enrollment-reference-api';
import {CreateEnrollmentRequest, UpdateEnrollmentRequest} from '../../infrastructure/enrollment-request';
import {EnrollmentPeriodReference, EnrollmentScheduleReference} from '../../infrastructure/enrollment-response';
import {StudentsStore} from '../../../students/application/students';
import {Student} from '../../../students/domain/model/student.entity';

export interface EnrollmentUmuxSurveyContext {
  flow: 'enrollment_registration';
  academyId: number;
}

@Injectable({providedIn: 'root'})
export class EnrollmentStore {
  private readonly enrollmentsSignal = signal<Enrollment[]>([]);
  private readonly filteredEnrollmentsSignal = signal<Enrollment[]>([]);
  private readonly isLoadingEnrollmentsSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly isDeletingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly formDataSignal = signal<EnrollmentFormData>({
    studentId: '', periodId: null, scheduleId: null,
    amount: '', currency: 'PEN', paymentStatus: 'PENDING', enrollmentStatus: 'ACTIVE'
  });
  private readonly searchQuerySignal = signal<string>('');
  private readonly selectedEnrollmentIdSignal = signal<number | null>(null);
  private readonly periodsSignal = signal<EnrollmentPeriodReference[]>([]);
  private readonly schedulesSignal = signal<EnrollmentScheduleReference[]>([]);
  private readonly isLoadingRefsSignal = signal<boolean>(false);
  private readonly umuxSurveyContextSignal = signal<EnrollmentUmuxSurveyContext | null>(null);

  readonly enrollments = this.enrollmentsSignal.asReadonly();
  readonly filteredEnrollments = this.filteredEnrollmentsSignal.asReadonly();
  readonly isLoadingEnrollments = this.isLoadingEnrollmentsSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isDeleting = this.isDeletingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly formData = this.formDataSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly selectedEnrollmentId = this.selectedEnrollmentIdSignal.asReadonly();
  readonly periods = this.periodsSignal.asReadonly();
  readonly schedules = this.schedulesSignal.asReadonly();
  readonly isLoadingRefs = this.isLoadingRefsSignal.asReadonly();
  readonly umuxSurveyContext = this.umuxSurveyContextSignal.asReadonly();
  readonly students: () => Student[] = () => this.studentsStore.students();
  readonly isEditing = () => this.selectedEnrollmentIdSignal() !== null;
  readonly currencies = ['PEN', 'USD'];
  readonly paymentStatuses = ['PENDING', 'PAID', 'PARTIAL', 'CANCELLED'];
  readonly enrollmentStatuses = ['ACTIVE', 'INACTIVE', 'COMPLETED', 'CANCELLED'];

  constructor(
    private readonly getEnrollmentsService: GetEnrollmentsService,
    private readonly createEnrollmentService: CreateEnrollmentService,
    private readonly updateEnrollmentService: UpdateEnrollmentService,
    private readonly deleteEnrollmentService: DeleteEnrollmentService,
    private readonly referenceApi: EnrollmentReferenceApi,
    private readonly studentsStore: StudentsStore
  ) {}

  loadEnrollments(): void {
    this.isLoadingEnrollmentsSignal.set(true);
    this.getEnrollmentsService.execute().subscribe({
      next: (enrollments) => {
        this.enrollmentsSignal.set(enrollments);
        this.applyFilter(this.searchQuerySignal());
        this.isLoadingEnrollmentsSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load enrollments');
        this.isLoadingEnrollmentsSignal.set(false);
      }
    });
  }

  loadReferences(): void {
    this.isLoadingRefsSignal.set(true);
    this.referenceApi.getPeriods().subscribe({
      next: (periods) => {
        this.periodsSignal.set(periods);
        this.referenceApi.getSchedules().subscribe({
          next: (schedules) => {
            this.schedulesSignal.set(schedules);
            this.isLoadingRefsSignal.set(false);
          },
          error: (err) => {
            this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load schedules');
            this.isLoadingRefsSignal.set(false);
          }
        });
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load periods');
        this.isLoadingRefsSignal.set(false);
      }
    });
  }

  createEnrollment(): void {
    const data = this.formDataSignal();
    if (!data.studentId || !data.periodId || !data.scheduleId || !data.amount) {
      this.errorSignal.set('Student, period, schedule and amount are required');
      return;
    }

    const request: CreateEnrollmentRequest = {
      studentId: Number(data.studentId),
      periodId: data.periodId,
      scheduleId: data.scheduleId,
      amount: data.amount,
      currency: data.currency,
      paymentStatus: data.paymentStatus
    };
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.createEnrollmentService.execute(request).subscribe({
      next: (createdEnrollment) => {
        localStorage.setItem('academyId', createdEnrollment.academyId.toString());
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadEnrollments();
        this.umuxSurveyContextSignal.set({
          flow: 'enrollment_registration',
          academyId: createdEnrollment.academyId,
        });
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to create enrollment');
        this.isLoadingSignal.set(false);
      }
    });
  }

  updateEnrollment(): void {
    const id = this.selectedEnrollmentIdSignal();
    const data = this.formDataSignal();
    if (!id) return;
    if (!data.amount) { this.errorSignal.set('Amount is required'); return; }

    const request: UpdateEnrollmentRequest = {
      amount: data.amount,
      currency: data.currency,
      enrollmentStatus: data.enrollmentStatus,
      paymentStatus: data.paymentStatus
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.updateEnrollmentService.execute(id, request).subscribe({
      next: () => { this.isLoadingSignal.set(false); this.resetForm(); this.loadEnrollments(); },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to update enrollment');
        this.isLoadingSignal.set(false);
      }
    });
  }

  deleteEnrollment(id: number): void {
    this.isDeletingSignal.set(true);
    this.errorSignal.set(null);
    this.deleteEnrollmentService.execute(id).subscribe({
      next: () => {
        this.isDeletingSignal.set(false);
        if (this.selectedEnrollmentIdSignal() === id) this.resetForm();
        this.loadEnrollments();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to delete enrollment');
        this.isDeletingSignal.set(false);
      }
    });
  }

  editEnrollment(enrollment: Enrollment): void {
    this.selectedEnrollmentIdSignal.set(enrollment.id);
    this.formDataSignal.set({
      studentId: String(enrollment.studentId),
      periodId: enrollment.periodId,
      scheduleId: enrollment.scheduleId,
      amount: String(enrollment.amount),
      currency: enrollment.currency,
      paymentStatus: enrollment.paymentStatus,
      enrollmentStatus: enrollment.enrollmentStatus
    });
    this.errorSignal.set(null);
  }

  cancelEdit(): void { this.resetForm(); }

  onFieldChange(field: keyof EnrollmentFormData, value: string): void {
    this.formDataSignal.update(d => ({ ...d, [field]: value }));
  }

  onFieldChangeNumber(field: 'periodId' | 'scheduleId', value: string): void {
    const v = value !== '' ? Number(value) : null;
    this.formDataSignal.update(d => ({ ...d, [field]: v }));
  }

  onSearchQueryChange(query: string): void { this.searchQuerySignal.set(query); this.applyFilter(query); }
  clearError(): void { this.errorSignal.set(null); }
  dismissUmuxSurvey(): void { this.umuxSurveyContextSignal.set(null); }

  private resetForm(): void {
    this.formDataSignal.set({
      studentId: '', periodId: null, scheduleId: null,
      amount: '', currency: 'PEN', paymentStatus: 'PENDING', enrollmentStatus: 'ACTIVE'
    });
    this.selectedEnrollmentIdSignal.set(null);
  }

  private applyFilter(query: string): void {
    const list = this.enrollmentsSignal();
    const q = query.trim().toLowerCase();
    if (!q) {
      this.filteredEnrollmentsSignal.set(list);
      return;
    }
    this.filteredEnrollmentsSignal.set(
      list.filter(e => {
        const student = this.studentsStore.students().find(s => s.id === e.studentId);
        const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
        return studentName.includes(q) || String(e.studentId).includes(q);
      })
    );
  }

  getStudentName(studentId: number | string): string {
    const student = this.studentsStore.students().find(s => s.id === Number(studentId));
    return student ? `${student.firstName} ${student.lastName}` : `#${studentId}`;
  }

  getPeriodName(periodId: number | null | undefined): string {
    if (!periodId) return '';
    const period = this.periodsSignal().find(p => p.id === periodId);
    return period?.periodName ?? `#${periodId}`;
  }

  getScheduleName(scheduleId: number | null | undefined): string {
    if (!scheduleId) return '';
    const schedule = this.schedulesSignal().find(s => s.id === scheduleId);
    return schedule?.name ?? `#${scheduleId}`;
  }
}
