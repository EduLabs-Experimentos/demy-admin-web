import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
  {
    path: '',
    children: [
      { path: 'sign-up', loadComponent: () => import('./public/pages/sign-up-page/sign-up-page').then(m => m.SignUpPage) },
      { path: 'sign-in', loadComponent: () => import('./public/pages/sign-in-page/sign-in-page').then(m => m.SignInPage) },
      { path: 'verify-account', loadComponent: () => import('./public/pages/verify-account-page/verify-account-page').then(m => m.VerifyAccountPage) },
      { path: 'complete-account', loadComponent: () => import('./public/pages/complete-account-page/complete-account-page').then(m => m.CompleteAccountPage) },
      { path: 'setup-academy', loadComponent: () => import('./public/pages/setup-academy-page/setup-academy-page').then(m => m.SetupAcademyPage) },
      { path: 'plan-select', loadComponent: () => import('./public/pages/plan-select-page/plan-select-page').then(m => m.PlanSelectPage) },
      { path: 'reset-password', loadComponent: () => import('./public/pages/reset-password-page/reset-password-page').then(m => m.ResetPasswordPage) }
    ]
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', loadComponent: () => import('./dashboard/home-page').then(m => m.HomePage) },
      { path: 'teachers', loadChildren: () => import('./teachers/presentation/teachers.routes').then(m => m.teachersRoutes) },
      { path: 'courses', loadChildren: () => import('./courses/presentation/courses.routes').then(m => m.coursesRoutes) },
      { path: 'classrooms', loadChildren: () => import('./classrooms/presentation/classrooms.routes').then(m => m.classroomsRoutes) },
      { path: 'schedules', loadChildren: () => import('./schedules/presentation/schedules.routes').then(m => m.schedulesRoutes) },
      { path: 'search-schedules', loadChildren: () => import('./scheduling/presentation/scheduling.routes').then(m => m.schedulingRoutes) },
      { path: 'academic-periods', loadChildren: () => import('./academic-periods/presentation/academic-periods.routes').then(m => m.academicPeriodsRoutes) },
      { path: 'enrollment', loadChildren: () => import('./enrollments/presentation/enrollments.routes').then(m => m.enrollmentsRoutes) },
      { path: 'academic-periods', loadChildren: () => import('./academic-periods/presentation/academic-periods.routes').then(m => m.academicPeriodsRoutes) },

      { path: 'students', loadChildren: () => import('./students/presentation/students.routes').then(m => m.studentsRoutes) },
      { path: 'billing', loadChildren:() => import('./billing/presentation/billing.routes').then(m => m.billingRoutes) },
      { path: 'finance', loadChildren: () => import('./accounting/presentation/accounting.routes').then(m => m.accountingRoutes) },

      { path: 'organization/courses', loadChildren: () => import('./courses/presentation/courses.routes').then(m => m.coursesRoutes) },
      { path: 'organization/classrooms', loadChildren: () => import('./classrooms/presentation/classrooms.routes').then(m => m.classroomsRoutes) }
    ]
  }
];
