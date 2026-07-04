import {Component, inject, OnInit} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {EnrollmentForm} from '../../components/enrollment-form/enrollment-form';
import {EnrollmentList} from '../../components/enrollment-list/enrollment-list';
import {EnrollmentStore} from '../../../application/store/enrollment.store';
import {UmuxSurveyDialog} from '../../../../shared/presentation/components/umux-survey-dialog/umux-survey-dialog';

@Component({
  selector: 'app-enrollment-page',
  standalone: true,
  imports: [TranslateModule, EnrollmentForm, EnrollmentList, UmuxSurveyDialog],
  templateUrl: './enrollment-page.html',
  styleUrl: './enrollment-page.scss'
})
export class EnrollmentPage implements OnInit {
  protected readonly store = inject(EnrollmentStore);

  ngOnInit(): void {
    this.store.loadEnrollments();
    this.store.loadReferences();
  }
}
