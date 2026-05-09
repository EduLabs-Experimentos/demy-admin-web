import {Component, inject, OnInit} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ScheduleForm} from '../../components/schedule-form/schedule-form';
import {ClassSessionForm} from '../../components/class-session-form/class-session-form';
import {ScheduleList} from '../../components/schedule-list/schedule-list';
import {ScheduleStore} from '../../../application/store/schedule.store';

@Component({
  selector: 'app-schedule-page',
  standalone: true,
  imports: [TranslateModule, ScheduleForm, ClassSessionForm, ScheduleList],
  templateUrl: './schedule-page.html',
  styleUrl: './schedule-page.scss'
})
export class SchedulePage implements OnInit {
  protected readonly store = inject(ScheduleStore);

  ngOnInit(): void {
    this.store.loadSchedules();
    this.store.loadReferences();
  }
}
