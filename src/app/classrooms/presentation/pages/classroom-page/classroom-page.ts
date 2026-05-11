import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ClassroomForm} from '../../components/classroom-form/classroom-form';
import {ClassroomList} from '../../components/classroom-list/classroom-list';
import {ClassroomStore} from '../../../application/store/classroom.store';

@Component({
  selector: 'app-classroom-page',
  standalone: true,
  imports: [TranslateModule, ClassroomForm, ClassroomList],
  templateUrl: './classroom-page.html',
  styleUrl: './classroom-page.scss'
})
export class ClassroomPage {
  protected readonly store = inject(ClassroomStore);
}
