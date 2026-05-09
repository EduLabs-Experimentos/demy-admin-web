import {Component, inject} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {ScheduleStore} from '../../../application/store/schedule.store';

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

@Component({
  selector: 'app-class-session-form',
  standalone: true,
  imports: [TranslateModule, InputTextModule, ButtonModule],
  templateUrl: './class-session-form.html',
  styleUrl: './class-session-form.scss'
})
export class ClassSessionForm {
  protected readonly store = inject(ScheduleStore);
  protected readonly daysOfWeek = DAYS_OF_WEEK;

  submit(): void {
    if (this.store.isEditingSession()) {
      this.store.updateClassSession();
    } else {
      this.store.addClassSession();
    }
  }
}
