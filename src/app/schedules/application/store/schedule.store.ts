import {Injectable, signal} from '@angular/core';
import {Schedule} from '../../domain/model/schedule.entity';
import {ClassSession} from '../../domain/model/class-session.entity';
import {WeeklyScheduleFormData} from '../../domain/model/weekly-schedule-form-data';
import {ClassSessionFormData} from '../../domain/model/class-session-form-data';
import {GetWeeklySchedulesService} from '../services/get-weekly-schedules.service';
import {CreateWeeklyScheduleService} from '../services/create-weekly-schedule.service';
import {UpdateWeeklyScheduleNameService} from '../services/update-weekly-schedule-name.service';
import {DeleteWeeklyScheduleService} from '../services/delete-weekly-schedule.service';
import {AddClassSessionService} from '../services/add-class-session.service';
import {RemoveClassSessionService} from '../services/remove-class-session.service';
import {UpdateClassSessionService} from '../services/update-class-session.service';
import {ReferenceApi} from '../../infrastructure/reference-api';
import {
  CreateWeeklyScheduleRequest,
  UpdateWeeklyScheduleNameRequest,
  AddScheduleToWeeklyRequest,
  UpdateScheduleRequest
} from '../../infrastructure/schedule-request';
import {ScheduleCourseResource, ScheduleClassroomResource, ScheduleTeacherResource} from '../../infrastructure/schedule-response';

@Injectable({providedIn: 'root'})
export class ScheduleStore {
  private readonly schedulesSignal = signal<Schedule[]>([]);
  private readonly filteredSchedulesSignal = signal<Schedule[]>([]);
  private readonly isLoadingSchedulesSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly isDeletingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly scheduleFormDataSignal = signal<WeeklyScheduleFormData>({ name: '' });
  private readonly sessionFormDataSignal = signal<ClassSessionFormData>({
    startTime: '',
    endTime: '',
    dayOfWeek: '',
    courseId: null,
    classroomId: null,
    teacherId: null
  });
  private readonly searchQuerySignal = signal<string>('');
  private readonly selectedScheduleIdSignal = signal<number | null>(null);
  private readonly editingScheduleIdSignal = signal<number | null>(null);
  private readonly editingSessionIdSignal = signal<number | null>(null);
  private readonly coursesSignal = signal<ScheduleCourseResource[]>([]);
  private readonly classroomsSignal = signal<ScheduleClassroomResource[]>([]);
  private readonly teachersSignal = signal<ScheduleTeacherResource[]>([]);
  private readonly isLoadingReferencesSignal = signal<boolean>(false);

  readonly schedules = this.schedulesSignal.asReadonly();
  readonly filteredSchedules = this.filteredSchedulesSignal.asReadonly();
  readonly isLoadingSchedules = this.isLoadingSchedulesSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isDeleting = this.isDeletingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly scheduleFormData = this.scheduleFormDataSignal.asReadonly();
  readonly sessionFormData = this.sessionFormDataSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly selectedScheduleId = this.selectedScheduleIdSignal.asReadonly();
  readonly editingScheduleId = this.editingScheduleIdSignal.asReadonly();
  readonly editingSessionId = this.editingSessionIdSignal.asReadonly();
  readonly courses = this.coursesSignal.asReadonly();
  readonly classrooms = this.classroomsSignal.asReadonly();
  readonly teachers = this.teachersSignal.asReadonly();
  readonly isLoadingReferences = this.isLoadingReferencesSignal.asReadonly();
  readonly selectedSchedule = () => {
    const id = this.selectedScheduleIdSignal();
    return id ? this.schedulesSignal().find(s => s.id === id) ?? null : null;
  };
  readonly isEditingSchedule = () => this.editingScheduleIdSignal() !== null;
  readonly isEditingSession = () => this.editingSessionIdSignal() !== null;

  constructor(
    private readonly getWeeklySchedulesService: GetWeeklySchedulesService,
    private readonly createWeeklyScheduleService: CreateWeeklyScheduleService,
    private readonly updateWeeklyScheduleNameService: UpdateWeeklyScheduleNameService,
    private readonly deleteWeeklyScheduleService: DeleteWeeklyScheduleService,
    private readonly addClassSessionService: AddClassSessionService,
    private readonly removeClassSessionService: RemoveClassSessionService,
    private readonly updateClassSessionService: UpdateClassSessionService,
    private readonly referenceApi: ReferenceApi
  ) {}

  loadSchedules(): void {
    this.isLoadingSchedulesSignal.set(true);
    this.getWeeklySchedulesService.execute().subscribe({
      next: (schedules) => {
        this.schedulesSignal.set(schedules);
        this.applyFilter(this.searchQuerySignal());
        this.isLoadingSchedulesSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load schedules');
        this.isLoadingSchedulesSignal.set(false);
      }
    });
  }

  loadReferences(): void {
    this.isLoadingReferencesSignal.set(true);
    this.referenceApi.getCourses().subscribe({
      next: (courses) => {
        this.coursesSignal.set(courses);
        this.referenceApi.getClassrooms().subscribe({
          next: (classrooms) => {
            this.classroomsSignal.set(classrooms);
            this.referenceApi.getTeachers().subscribe({
              next: (teachers) => {
                this.teachersSignal.set(teachers);
                this.isLoadingReferencesSignal.set(false);
              },
              error: (err) => {
                this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load teachers');
                this.isLoadingReferencesSignal.set(false);
              }
            });
          },
          error: (err) => {
            this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load classrooms');
            this.isLoadingReferencesSignal.set(false);
          }
        });
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load courses');
        this.isLoadingReferencesSignal.set(false);
      }
    });
  }

  createSchedule(): void {
    const name = this.scheduleFormDataSignal().name.trim();
    if (!name) {
      this.errorSignal.set('Schedule name is required');
      return;
    }

    const request: CreateWeeklyScheduleRequest = { name };
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.createWeeklyScheduleService.execute(request).subscribe({
      next: (created) => {
        this.isLoadingSignal.set(false);
        this.resetScheduleForm();
        this.selectedScheduleIdSignal.set(created.id);
        this.loadSchedules();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to create schedule');
        this.isLoadingSignal.set(false);
      }
    });
  }

  updateScheduleName(): void {
    const scheduleId = this.editingScheduleIdSignal();
    const name = this.scheduleFormDataSignal().name.trim();
    if (!scheduleId) return;
    if (!name) {
      this.errorSignal.set('Schedule name is required');
      return;
    }

    const request: UpdateWeeklyScheduleNameRequest = { name };
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.updateWeeklyScheduleNameService.execute(scheduleId, request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetScheduleForm();
        this.loadSchedules();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to update schedule');
        this.isLoadingSignal.set(false);
      }
    });
  }

  deleteSchedule(scheduleId: number): void {
    this.isDeletingSignal.set(true);
    this.errorSignal.set(null);
    this.deleteWeeklyScheduleService.execute(scheduleId).subscribe({
      next: () => {
        this.isDeletingSignal.set(false);
        if (this.selectedScheduleIdSignal() === scheduleId) {
          this.selectedScheduleIdSignal.set(null);
        }
        if (this.editingScheduleIdSignal() === scheduleId) {
          this.resetScheduleForm();
        }
        this.loadSchedules();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to delete schedule');
        this.isDeletingSignal.set(false);
      }
    });
  }

  addClassSession(): void {
    const scheduleId = this.selectedScheduleIdSignal();
    const formData = this.sessionFormDataSignal();
    if (!scheduleId) {
      this.errorSignal.set('No schedule selected');
      return;
    }
    if (!formData.startTime || !formData.endTime || !formData.dayOfWeek || !formData.courseId || !formData.classroomId || !formData.teacherId) {
      this.errorSignal.set('All fields are required');
      return;
    }

    const teacher = this.teachersSignal().find(t => t.id === formData.teacherId);
    if (!teacher) {
      this.errorSignal.set('Teacher not found');
      return;
    }

    const request: AddScheduleToWeeklyRequest = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      dayOfWeek: formData.dayOfWeek,
      courseId: formData.courseId,
      classroomId: formData.classroomId,
      teacherFirstName: teacher.firstName,
      teacherLastName: teacher.lastName
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.addClassSessionService.execute(scheduleId, request).subscribe({
      next: (updatedSchedule) => {
        this.isLoadingSignal.set(false);
        this.resetSessionForm();
        this.updateScheduleInList(updatedSchedule);
        this.selectedScheduleIdSignal.set(scheduleId);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to add class session');
        this.isLoadingSignal.set(false);
      }
    });
  }

  removeClassSession(scheduleId: number, classSessionId: number): void {
    this.isDeletingSignal.set(true);
    this.errorSignal.set(null);
    this.removeClassSessionService.execute(scheduleId, classSessionId).subscribe({
      next: (updatedSchedule) => {
        this.isDeletingSignal.set(false);
        this.updateScheduleInList(updatedSchedule);
        this.selectedScheduleIdSignal.set(scheduleId);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to remove class session');
        this.isDeletingSignal.set(false);
      }
    });
  }

  editClassSession(schedule: Schedule, session: ClassSession): void {
    this.selectedScheduleIdSignal.set(schedule.id);
    this.editingSessionIdSignal.set(session.id);
    this.sessionFormDataSignal.set({
      startTime: session.startTime,
      endTime: session.endTime,
      dayOfWeek: session.dayOfWeek,
      courseId: session.course.id,
      classroomId: session.classroom.id,
      teacherId: session.teacher.id
    });
    this.errorSignal.set(null);
  }

  updateClassSession(): void {
    const sessionId = this.editingSessionIdSignal();
    const formData = this.sessionFormDataSignal();
    if (!sessionId) return;
    if (!formData.classroomId || !formData.startTime || !formData.endTime || !formData.dayOfWeek) {
      this.errorSignal.set('Classroom, start time, end time and day are required');
      return;
    }

    const request: UpdateScheduleRequest = {
      classroomId: formData.classroomId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      dayOfWeek: formData.dayOfWeek
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.updateClassSessionService.execute(sessionId, request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetSessionForm();
        this.loadSchedules();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to update class session');
        this.isLoadingSignal.set(false);
      }
    });
  }

  editSchedule(schedule: Schedule): void {
    this.editingScheduleIdSignal.set(schedule.id);
    this.scheduleFormDataSignal.set({ name: schedule.name });
    this.errorSignal.set(null);
  }

  cancelEditSchedule(): void {
    this.resetScheduleForm();
  }

  cancelEditSession(): void {
    this.resetSessionForm();
  }

  toggleSelectSchedule(scheduleId: number): void {
    const current = this.selectedScheduleIdSignal();
    this.selectedScheduleIdSignal.set(current === scheduleId ? null : scheduleId);
  }

  onScheduleNameChange(value: string): void {
    this.scheduleFormDataSignal.update(data => ({ ...data, name: value }));
  }

  onSessionFieldChange(field: keyof ClassSessionFormData, value: string): void {
    this.sessionFormDataSignal.update(data => ({ ...data, [field]: value }));
  }

  onSessionFieldChangeNumber(field: 'courseId' | 'classroomId' | 'teacherId', value: string): void {
    const numValue = value !== '' && value !== null ? Number(value) : null;
    this.sessionFormDataSignal.update(data => ({ ...data, [field]: numValue }));
  }

  onSearchQueryChange(query: string): void {
    this.searchQuerySignal.set(query);
    this.applyFilter(query);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private updateScheduleInList(updatedSchedule: Schedule): void {
    this.schedulesSignal.update(schedules =>
      schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s)
    );
    this.applyFilter(this.searchQuerySignal());
  }

  private resetScheduleForm(): void {
    this.scheduleFormDataSignal.set({ name: '' });
    this.editingScheduleIdSignal.set(null);
  }

  private resetSessionForm(): void {
    this.sessionFormDataSignal.set({
      startTime: '',
      endTime: '',
      dayOfWeek: '',
      courseId: null,
      classroomId: null,
      teacherId: null
    });
    this.editingSessionIdSignal.set(null);
  }

  private applyFilter(query: string): void {
    const schedules = this.schedulesSignal();
    const filtered = query.trim()
      ? schedules.filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()))
      : schedules;
    this.filteredSchedulesSignal.set(filtered);
  }
}
