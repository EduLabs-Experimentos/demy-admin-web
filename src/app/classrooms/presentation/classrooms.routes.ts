import {Routes} from '@angular/router';

const classroomPage = () => import('./pages/classroom-page/classroom-page').then(m => m.ClassroomPage);

export const classroomsRoutes: Routes = [
  { path: '', loadComponent: classroomPage }
];
