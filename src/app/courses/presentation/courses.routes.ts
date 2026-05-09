import {Routes} from '@angular/router';

const coursePage = () => import('./pages/course-page/course-page').then(m => m.CoursePage);

export const coursesRoutes: Routes = [
  { path: '', loadComponent: coursePage }
];
