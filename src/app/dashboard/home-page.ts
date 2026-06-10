import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardStore } from './application/dashboard.store';
import {
  IncomeExpenseChartComponent,
  ExpenseCategoriesChartComponent,
  AcademicStatsComponent
} from './presentation/components/dashboard-charts';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
    IncomeExpenseChartComponent,
    ExpenseCategoriesChartComponent,
    AcademicStatsComponent
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage implements OnInit {
  protected store = inject(DashboardStore);

  ngOnInit() {
    this.store.loadDashboard();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'USD' }).format(value);
  }

  refresh() {
    this.store.refresh();
  }
}