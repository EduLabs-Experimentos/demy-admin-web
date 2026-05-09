import {Injectable, signal} from '@angular/core';
import {Schedule} from '../../../schedules/domain/model/schedule.entity';
import {ClassSession} from '../../../schedules/domain/model/class-session.entity';
import {GetSchedulesForSchedulingService} from '../services/get-schedules-for-scheduling.service';

const ALL_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const START_HOUR = 7;
const END_HOUR = 21;

export interface TimetableSlot {
  session: ClassSession | null;
  rowspan: number;
  hidden: boolean;
}

export interface TimetableGrid {
  days: string[];
  hours: string[];
  slots: TimetableSlot[][];
}

@Injectable({providedIn: 'root'})
export class SchedulingStore {
  private readonly schedulesSignal = signal<Schedule[]>([]);
  private readonly isLoadingSchedulesSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly selectedScheduleIdSignal = signal<number | null>(null);
  private readonly timetableGridSignal = signal<TimetableGrid | null>(null);

  readonly schedules = this.schedulesSignal.asReadonly();
  readonly isLoadingSchedules = this.isLoadingSchedulesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedScheduleId = this.selectedScheduleIdSignal.asReadonly();
  readonly timetableGrid = this.timetableGridSignal.asReadonly();
  readonly selectedSchedule = () => {
    const id = this.selectedScheduleIdSignal();
    return id ? this.schedulesSignal().find(s => s.id === id) ?? null : null;
  };

  constructor(
    private readonly getSchedulesService: GetSchedulesForSchedulingService
  ) {}

  loadSchedules(): void {
    this.isLoadingSchedulesSignal.set(true);
    this.getSchedulesService.execute().subscribe({
      next: (schedules) => {
        this.schedulesSignal.set(schedules);
        this.isLoadingSchedulesSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load schedules');
        this.isLoadingSchedulesSignal.set(false);
      }
    });
  }

  selectSchedule(scheduleId: number): void {
    this.selectedScheduleIdSignal.set(scheduleId);
    this.errorSignal.set(null);

    const schedule = this.schedulesSignal().find(s => s.id === scheduleId);
    if (!schedule || schedule.classSessions.length === 0) {
      this.timetableGridSignal.set(null);
      return;
    }

    this.timetableGridSignal.set(this.buildTimetable(schedule.classSessions));
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private buildTimetable(sessions: ClassSession[]): TimetableGrid {
    const days = ALL_DAYS;
    const hours = this.generateHours();
    const slots: TimetableSlot[][] = hours.map(() =>
      days.map(() => ({ session: null, rowspan: 1, hidden: false }))
    );

    for (const session of sessions) {
      const dayIndex = days.indexOf(session.dayOfWeek);
      if (dayIndex === -1) continue;

      const startMinutes = this.timeToMinutes(session.startTime);
      const endMinutes = this.timeToMinutes(session.endTime);
      const firstHour = START_HOUR;
      const startSlot = Math.max(0, Math.floor((startMinutes - firstHour * 60) / 60));
      const endSlot = Math.min(hours.length, Math.ceil((endMinutes - firstHour * 60) / 60));
      const rowspan = Math.max(1, endSlot - startSlot);

      if (startSlot >= 0 && startSlot < hours.length) {
        slots[startSlot][dayIndex] = { session, rowspan, hidden: false };
        for (let i = startSlot + 1; i < startSlot + rowspan && i < hours.length; i++) {
          slots[i][dayIndex] = { session: null, rowspan: 0, hidden: true };
        }
      }
    }

    return { days, hours, slots };
  }

  private generateHours(): string[] {
    const hours: string[] = [];
    for (let h = START_HOUR; h < END_HOUR; h++) {
      hours.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return hours;
  }

  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }
}
