import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CourseForm} from '../../components/course-form/course-form';
import {CourseList} from '../../components/course-list/course-list';
import {CourseStore} from '../../../application/store/course.store';

@Component({
  selector: 'app-course-page',
  standalone: true,
  imports: [TranslateModule, CourseForm, CourseList],
  templateUrl: './course-page.html',
  styleUrl: './course-page.scss'
})
export class CoursePage {
  protected readonly store = inject(CourseStore);
}
