import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {TeacherStore} from '../../../application/store/teacher.store';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, InputTextModule, ButtonModule],
  templateUrl: './teacher-form.html',
  styleUrl: './teacher-form.scss'
})
export class TeacherForm {
  protected readonly store = inject(TeacherStore);

  register(): void {
    this.store.registerTeacher();
  }
}
