import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {TranslateModule} from '@ngx-translate/core';
import {AcademicPeriodStore} from '../../../application/store/academic-period.store';

@Component({
  selector: 'app-academic-period-form',
  standalone: true,
  imports: [FormsModule, TranslateModule, InputTextModule, ButtonModule, ToggleSwitchModule],
  templateUrl: './academic-period-form.html',
  styleUrl: './academic-period-form.scss'
})
export class AcademicPeriodForm {
  protected readonly store = inject(AcademicPeriodStore);

  submit(): void {
    if (this.store.isEditing()) {
      this.store.updatePeriod();
    } else {
      this.store.createPeriod();
    }
  }
}
