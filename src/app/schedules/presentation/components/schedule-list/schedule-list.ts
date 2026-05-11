import {Component, inject} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {ScheduleStore} from '../../../application/store/schedule.store';
import type {ClassSession} from '../../../domain/model/class-session.entity';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [InputTextModule, ButtonModule, TranslateModule],
  templateUrl: './schedule-list.html',
  styleUrl: './schedule-list.scss'
})
export class ScheduleList {
  protected readonly store = inject(ScheduleStore);

  editSchedule(scheduleId: number): void {
    const schedule = this.store.schedules().find(s => s.id === scheduleId);
    if (schedule) {
      this.store.editSchedule(schedule);
    }
  }

  deleteSchedule(scheduleId: number): void {
    this.store.deleteSchedule(scheduleId);
  }

  editSession(schedule: any, session: ClassSession): void {
    this.store.editClassSession(schedule, session);
  }

  deleteSession(scheduleId: number, sessionId: number): void {
    this.store.removeClassSession(scheduleId, sessionId);
  }

  toggleSelect(scheduleId: number, event: Event): void {
    event.stopPropagation();
    this.store.toggleSelectSchedule(scheduleId);
  }
}
