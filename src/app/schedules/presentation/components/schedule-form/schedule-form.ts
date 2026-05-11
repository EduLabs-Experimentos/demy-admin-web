import {Component, inject} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {ScheduleStore} from '../../../application/store/schedule.store';

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [TranslateModule, InputTextModule, ButtonModule],
  templateUrl: './schedule-form.html',
  styleUrl: './schedule-form.scss'
})
export class ScheduleForm {
  protected readonly store = inject(ScheduleStore);

  submit(): void {
    if (this.store.isEditingSchedule()) {
      this.store.updateScheduleName();
    } else {
      this.store.createSchedule();
    }
  }
}
