import {Routes} from '@angular/router';

const accountingPage = () => import('./pages/accounting-page/accounting-page').then(m => m.AccountingPage);

export const accountingRoutes: Routes = [
  {path: '', loadComponent: accountingPage}
];