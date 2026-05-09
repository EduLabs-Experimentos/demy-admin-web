import {Component, inject, OnInit} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {ClassroomStore} from '../../../application/store/classroom.store';

@Component({
  selector: 'app-classroom-list',
  standalone: true,
  imports: [InputTextModule, ButtonModule, TranslateModule],
  templateUrl: './classroom-list.html',
  styleUrl: './classroom-list.scss'
})
export class ClassroomList implements OnInit {
  protected readonly store = inject(ClassroomStore);

  ngOnInit(): void {
    this.store.loadClassrooms();
  }

  editClassroom(classroomId: number): void {
    const classroom = this.store.classrooms().find(c => c.id === classroomId);
    if (classroom) {
      this.store.editClassroom(classroom);
    }
  }

  deleteClassroom(classroomId: number): void {
    this.store.deleteClassroom(classroomId);
  }
}
