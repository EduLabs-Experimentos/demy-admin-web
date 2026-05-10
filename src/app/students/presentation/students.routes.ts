import { Routes } from '@angular/router';

const studentsView = () => import('./views/students/students').then(m => m.Students);

export const studentsRoutes: Routes = [
  { path: '', loadComponent: studentsView } // Cambiamos a ruta vacía para que el padre mande
];
