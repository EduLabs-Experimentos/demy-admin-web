import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';
import { iamGuard } from './iam/infrastructure/iam.guard';

// 1. Ya NO importamos studentsRoutes aquí arriba.
// Dejamos que Angular lo importe dinámicamente con la función de abajo.

// 2. Le cambiamos el nombre a la función para que sea súper claro
const loadStudentRoutes = () => import('./students/presentation/students.route').then(m => m.studentsRoutes);

export const routes: Routes = [
  { path: 'home', component: Home },
  // 3. Llamamos a la función que acabamos de crear
  { path: 'students', loadChildren: loadStudentRoutes, canActivate: [iamGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // ... resto de tus rutas
];
