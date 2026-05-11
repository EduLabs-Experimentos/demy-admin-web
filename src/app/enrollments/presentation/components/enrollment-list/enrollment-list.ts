import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {EnrollmentStore} from '../../../application/store/enrollment.store';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, TranslateModule],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss'
})
export class EnrollmentList {
  protected readonly store = inject(EnrollmentStore);

  editEnrollment(id: number): void {
    const e = this.store.enrollments().find(x => x.id === id);
    if (e) this.store.editEnrollment(e);
  }

  deleteEnrollment(id: number): void { this.store.deleteEnrollment(id); }
}
