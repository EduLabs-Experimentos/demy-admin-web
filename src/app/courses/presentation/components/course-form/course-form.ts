import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {CourseStore} from '../../../application/store/course.store';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, InputTextModule, TextareaModule, ButtonModule],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss'
})
export class CourseForm {
  protected readonly store = inject(CourseStore);

  submit(): void {
    if (this.store.isEditing()) {
      this.store.updateCourse();
    } else {
      this.store.createCourse();
    }
  }
}
