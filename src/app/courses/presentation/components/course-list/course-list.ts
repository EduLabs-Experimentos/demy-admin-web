import {Component, inject, OnInit} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {CourseStore} from '../../../application/store/course.store';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [InputTextModule, ButtonModule, TranslateModule],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss'
})
export class CourseList implements OnInit {
  protected readonly store = inject(CourseStore);

  ngOnInit(): void {
    this.store.loadCourses();
  }

  editCourse(courseId: number): void {
    const course = this.store.courses().find(c => c.id === courseId);
    if (course) {
      this.store.editCourse(course);
    }
  }

  deleteCourse(courseId: number): void {
    this.store.deleteCourse(courseId);
  }
}
