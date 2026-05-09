import {Routes} from '@angular/router';

const teacherPage = () => import('./pages/teacher-page/teacher-page').then(m => m.TeacherPage);

export const teachersRoutes: Routes = [
  { path: '', loadComponent: teacherPage }
];
