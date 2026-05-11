import {Routes} from '@angular/router';

const schedulePage = () => import('./pages/schedule-page/schedule-page').then(m => m.SchedulePage);

export const schedulesRoutes: Routes = [
  { path: '', loadComponent: schedulePage }
];
