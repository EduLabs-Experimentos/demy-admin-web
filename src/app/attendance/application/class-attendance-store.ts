import { Injectable, signal } from '@angular/core';
import { ClassAttendance, AttendanceStatus } from '../domain/model/class-attendance.entity';
import { ClassAttendanceApi } from '../infrastructure/class-attendance-api';

@Injectable({ providedIn: 'root' })
export class ClassAttendanceStore {
  private readonly attendancesSignal = signal<ClassAttendance[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly successSignal = signal<boolean>(false);

  readonly attendances = this.attendancesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly success = this.successSignal.asReadonly();

  constructor(private api: ClassAttendanceApi) {}

  loadAll(): void {
    this.loadingSignal.set(true);
    this.api.getAll().subscribe({
      next: list => {
        this.attendancesSignal.set(list);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.attendancesSignal.set([]);
        this.loadingSignal.set(false);
      }
    });
  }

  patchStatus(id: number, dni: string, status: AttendanceStatus): void {
    this.api.patchStatus(id, dni, status).subscribe({
      next: updated => {
        this.attendancesSignal.update(list =>
          list.map(a => a.id === updated.id ? updated : a)
        );
        this.showSuccess();
      },
      error: () => {}
    });
  }

  private showSuccess(): void {
    this.successSignal.set(true);
    setTimeout(() => this.successSignal.set(false), 3000);
  }
}
