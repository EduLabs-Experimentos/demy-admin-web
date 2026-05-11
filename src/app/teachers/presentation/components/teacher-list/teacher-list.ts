import {Component, inject, OnInit} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {TranslateModule} from '@ngx-translate/core';
import {TeacherStore} from '../../../application/store/teacher.store';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [InputTextModule, TranslateModule],
  templateUrl: './teacher-list.html',
  styleUrl: './teacher-list.scss'
})
export class TeacherList implements OnInit {
  protected readonly store = inject(TeacherStore);

  ngOnInit(): void {
    this.store.loadTeachers();
  }
}
