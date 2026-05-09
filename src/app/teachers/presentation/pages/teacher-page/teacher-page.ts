import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {TeacherForm} from '../../components/teacher-form/teacher-form';
import {TeacherList} from '../../components/teacher-list/teacher-list';
import {TeacherStore} from '../../../application/store/teacher.store';

@Component({
  selector: 'app-teacher-page',
  standalone: true,
  imports: [TranslateModule, TeacherForm, TeacherList],
  templateUrl: './teacher-page.html',
  styleUrl: './teacher-page.scss'
})
export class TeacherPage {
  protected readonly store = inject(TeacherStore);
}
