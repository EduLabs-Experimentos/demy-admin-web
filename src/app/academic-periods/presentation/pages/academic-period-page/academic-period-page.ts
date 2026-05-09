import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {AcademicPeriodForm} from '../../components/academic-period-form/academic-period-form';
import {AcademicPeriodList} from '../../components/academic-period-list/academic-period-list';
import {AcademicPeriodStore} from '../../../application/store/academic-period.store';

@Component({
  selector: 'app-academic-period-page',
  standalone: true,
  imports: [TranslateModule, AcademicPeriodForm, AcademicPeriodList],
  templateUrl: './academic-period-page.html',
  styleUrl: './academic-period-page.scss'
})
export class AcademicPeriodPage {
  protected readonly store = inject(AcademicPeriodStore);
}
