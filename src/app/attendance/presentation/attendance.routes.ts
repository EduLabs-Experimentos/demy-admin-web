import { Routes } from '@angular/router';

export const attendanceRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/attendance-page/attendance-page').then(m => m.AttendancePage) }
];
