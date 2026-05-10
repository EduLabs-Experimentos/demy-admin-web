import {Routes} from '@angular/router';

const enrollmentPage = () => import('./pages/enrollment-page/enrollment-page').then(m => m.EnrollmentPage);

export const enrollmentsRoutes: Routes = [
  { path: '', loadComponent: enrollmentPage }
];
