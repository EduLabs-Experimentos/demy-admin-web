import {Component, inject} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {EnrollmentStore} from '../../../application/store/enrollment.store';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [TranslateModule, InputTextModule, ButtonModule],
  templateUrl: './enrollment-form.html',
  styleUrl: './enrollment-form.scss'
})
export class EnrollmentForm {
  protected readonly store = inject(EnrollmentStore);

  submit(): void {
    if (this.store.isEditing()) this.store.updateEnrollment();
    else this.store.createEnrollment();
  }
}
