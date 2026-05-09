import {Component, inject} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {ClassroomStore} from '../../../application/store/classroom.store';

@Component({
  selector: 'app-classroom-form',
  standalone: true,
  imports: [TranslateModule, InputTextModule, ButtonModule],
  templateUrl: './classroom-form.html',
  styleUrl: './classroom-form.scss'
})
export class ClassroomForm {
  protected readonly store = inject(ClassroomStore);

  submit(): void {
    if (this.store.isEditing()) {
      this.store.updateClassroom();
    } else {
      this.store.createClassroom();
    }
  }
}
