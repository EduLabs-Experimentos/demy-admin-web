import {Routes} from '@angular/router';

const academicPeriodPage = () => import('./pages/academic-period-page/academic-period-page').then(m => m.AcademicPeriodPage);

export const academicPeriodsRoutes: Routes = [
  { path: '', loadComponent: academicPeriodPage }
];
