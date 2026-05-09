import {Component, inject, OnInit} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {Timetable} from '../../components/timetable/timetable';
import {SchedulingStore} from '../../../application/store/scheduling.store';

@Component({
  selector: 'app-scheduling-page',
  standalone: true,
  imports: [TranslateModule, Timetable],
  templateUrl: './scheduling-page.html',
  styleUrl: './scheduling-page.scss'
})
export class SchedulingPage implements OnInit {
  protected readonly store = inject(SchedulingStore);

  ngOnInit(): void {
    this.store.loadSchedules();
  }

  onScheduleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    if (id) {
      this.store.selectSchedule(id);
    }
  }
}
