import {Routes} from '@angular/router';

const schedulingPage = () => import('./pages/scheduling-page/scheduling-page').then(m => m.SchedulingPage);

export const schedulingRoutes: Routes = [
  { path: '', loadComponent: schedulingPage }
];
