import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BaseChartDirective } from 'ng2-charts';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardStore } from '../../application/dashboard.store';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card [style]="{ 'min-width': '200px', 'text-align': 'center' }">
      <div class="stat-card">
        <i [class]="icon" [style.color]="color"></i>
        <span class="stat-value">{{ value | number }}</span>
        <span class="stat-label">{{ label }}</span>
      </div>
    </p-card>
  `,
  styles: [`
    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
    }
    i {
      font-size: 2rem;
    }
    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a2e;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `]
})
export class StatCardComponent {
  @Input() icon: string = 'pi pi-chart-bar';
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() color: string = '#3F51B5';
}

@Component({
  selector: 'app-income-expense-chart',
  standalone: true,
  imports: [CommonModule, CardModule, BaseChartDirective, TranslateModule],
  template: `
    <p-card styleClass="chart-card">
      <ng-template pTemplate="header">
        <span class="chart-header">{{ 'dashboard.charts.incomeExpense' | translate }}</span>
      </ng-template>
      <div class="chart-container">
        <canvas baseChart
          [data]="lineChartData"
          [options]="lineChartOptions"
          [type]="'line'">
        </canvas>
      </div>
    </p-card>
  `,
  styles: [`
    :host { display: block; }
    .chart-header {
      display: block;
      padding: 16px 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--p-surface-950);
      font-family: 'Inter', sans-serif;
      border-bottom: 1px solid var(--p-surface-200);
    }
    .chart-container { height: 260px; position: relative; padding-top: 16px; }
  `]
})
export class IncomeExpenseChartComponent {
  @Input() chartData: { labels: string[]; income: number[]; expense: number[] } = { labels: [], income: [], expense: [] };

  get lineChartData() {
    return {
      labels: this.chartData.labels,
      datasets: [
        {
          label: 'Ingresos',
          data: this.chartData.income,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Gastos',
          data: this.chartData.expense,
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
}

@Component({
  selector: 'app-expense-categories-chart',
  standalone: true,
  imports: [CommonModule, CardModule, BaseChartDirective, TranslateModule],
  template: `
    <p-card styleClass="chart-card">
      <ng-template pTemplate="header">
        <span class="chart-header">{{ 'dashboard.charts.expenseCategories' | translate }}</span>
      </ng-template>
      <div class="chart-container">
        <canvas baseChart
          [data]="doughnutChartData"
          [options]="doughnutChartOptions"
          [type]="'doughnut'">
        </canvas>
      </div>
    </p-card>
  `,
  styles: [`
    :host { display: block; }
    .chart-header {
      display: block;
      padding: 16px 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--p-surface-950);
      font-family: 'Inter', sans-serif;
      border-bottom: 1px solid var(--p-surface-200);
    }
    .chart-container { height: 260px; position: relative; padding-top: 16px; }
  `]
})
export class ExpenseCategoriesChartComponent {
  @Input() categories: { category: string; amount: number; color: string }[] = [];

  get doughnutChartData() {
    return {
      labels: this.categories.map(c => c.category),
      datasets: [{
        data: this.categories.map(c => c.amount),
        backgroundColor: this.categories.map(c => c.color),
        borderWidth: 0
      }]
    };
  }

  doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: 'var(--p-surface-700)', padding: 16 }
      }
    }
  };
}

@Component({
  selector: 'app-enrollment-trend-chart',
  standalone: true,
  imports: [CommonModule, CardModule, BaseChartDirective],
  template: `
    <p-card styleClass="chart-card">
      <ng-template pTemplate="header">
        <span class="chart-header">Tendencia de Matrículas</span>
      </ng-template>
      <div class="chart-container">
        <canvas baseChart
          [data]="barChartData"
          [options]="barChartOptions"
          [type]="'bar'">
        </canvas>
      </div>
    </p-card>
  `,
  styles: [`
    :host { display: block; }
    .chart-header {
      display: block;
      padding: 16px 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--p-surface-800);
      font-family: 'Inter', sans-serif;
      border-bottom: 1px solid var(--p-surface-100);
    }
    .chart-container { height: 260px; position: relative; padding-top: 16px; }
  `]
})
export class EnrollmentTrendChartComponent {
  @Input() data: { month: string; count: number }[] = [];

  get barChartData() {
    return {
      labels: this.data.map(d => d.month),
      datasets: [{
        label: 'Matrículas',
        data: this.data.map(d => d.count),
        backgroundColor: '#3F51B5'
      }]
    };
  }

  barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
}

@Component({
  selector: 'app-courses-category-chart',
  standalone: true,
  imports: [CommonModule, CardModule, BaseChartDirective],
  template: `
    <p-card styleClass="chart-card">
      <ng-template pTemplate="header">
        <span class="chart-header">Cursos por Categoría</span>
      </ng-template>
      <div class="chart-container">
        <canvas baseChart
          [data]="doughnutChartData"
          [options]="doughnutChartOptions"
          [type]="'doughnut'">
        </canvas>
      </div>
    </p-card>
  `,
  styles: [`
    :host { display: block; }
    .chart-header {
      display: block;
      padding: 16px 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--p-surface-800);
      font-family: 'Inter', sans-serif;
      border-bottom: 1px solid var(--p-surface-100);
    }
    .chart-container { height: 260px; position: relative; padding-top: 16px; }
  `]
})
export class CoursesCategoryChartComponent {
  @Input() data: { category: string; count: number }[] = [];

  get doughnutChartData() {
    const colors = ['#3F51B5', '#F57C00', '#AB47BC', '#4CAF50', '#F44336'];
    return {
      labels: this.data.map(d => d.category),
      datasets: [{
        data: this.data.map(d => d.count),
        backgroundColor: colors.slice(0, this.data.length)
      }]
    };
  }

  doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const }
    }
  };
}

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule],
  template: `
    <p-card styleClass="chart-card">
      <ng-template pTemplate="header">
        <span class="chart-header">Transacciones Recientes</span>
      </ng-template>
      <p-table [value]="transactions" [rows]="5" [paginator]="true" [showCurrentPageReport]="true"
        styleClass="p-datatable-sm"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}">
        <ng-template pTemplate="header">
          <tr>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-txn>
          <tr>
            <td>{{ txn.description }}</td>
            <td>
              <span [class]="'type-badge ' + txn.type.toLowerCase()">{{ txn.type }}</span>
            </td>
            <td>{{ txn.amount | currency:'USD' }}</td>
            <td>{{ txn.date | date:'dd/MM/yyyy' }}</td>
            <td>
              <span [class]="'status-badge ' + txn.status.toLowerCase()">{{ txn.status }}</span>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  styles: [`
    :host { display: block; }
    .chart-header {
      display: block;
      padding: 16px 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: var(--p-surface-800);
      font-family: 'Inter', sans-serif;
      border-bottom: 1px solid var(--p-surface-100);
    }
    .type-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .type-badge.income { background: rgba(76, 175, 80, 0.12); color: #2E7D32; }
    .type-badge.expense { background: rgba(244, 67, 54, 0.12); color: #C62828; }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .status-badge.paid { background: rgba(76, 175, 80, 0.12); color: #2E7D32; }
    .status-badge.pending { background: rgba(255, 152, 0, 0.12); color: #E65100; }
  `]
})
export class RecentTransactionsComponent {
  @Input() transactions: any[] = [];
}

@Component({
  selector: 'app-academic-stats',
  standalone: true,
  imports: [CommonModule, CardModule, TranslateModule],
  template: `
    <div class="academic-stats">
      <p-card styleClass="stat-academic">
        <div class="stat-item">
          <i class="pi pi-users"></i>
          <span class="stat-value">{{ totalStudents }}</span>
          <span class="stat-label">{{ 'dashboard.academic.students' | translate }}</span>
        </div>
      </p-card>
      <p-card styleClass="stat-academic">
        <div class="stat-item">
          <i class="pi pi-user"></i>
          <span class="stat-value">{{ totalTeachers }}</span>
          <span class="stat-label">{{ 'dashboard.academic.teachers' | translate }}</span>
        </div>
      </p-card>
      <p-card styleClass="stat-academic">
        <div class="stat-item">
          <i class="pi pi-book"></i>
          <span class="stat-value">{{ totalCourses }}</span>
          <span class="stat-label">{{ 'dashboard.academic.courses' | translate }}</span>
        </div>
      </p-card>
      <p-card styleClass="stat-academic">
        <div class="stat-item">
          <i class="pi pi-home"></i>
          <span class="stat-value">{{ totalClassrooms }}</span>
          <span class="stat-label">{{ 'dashboard.academic.classrooms' | translate }}</span>
        </div>
      </p-card>
      <p-card styleClass="stat-academic">
        <div class="stat-item">
          <i class="pi pi-check-circle"></i>
          <span class="stat-value">{{ totalEnrollments }}</span>
          <span class="stat-label">{{ 'dashboard.academic.enrollments' | translate }}</span>
        </div>
      </p-card>
      <p-card styleClass="stat-academic">
        <div class="stat-item">
          <i class="pi pi-calendar"></i>
          <span class="stat-value">{{ totalSchedules }}</span>
          <span class="stat-label">{{ 'dashboard.academic.schedules' | translate }}</span>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .academic-stats {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 12px;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 8px;
    }
    i {
      font-size: 1.5rem;
      color: var(--demy-primary);
    }
    .stat-value {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--p-surface-950);
      font-family: 'Inter', sans-serif;
      line-height: 1.2;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--p-surface-600);
      font-family: 'Inter', sans-serif;
    }
    @media (max-width: 1200px) {
      .academic-stats { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 600px) {
      .academic-stats { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class AcademicStatsComponent {
  @Input() totalStudents = 0;
  @Input() totalTeachers = 0;
  @Input() totalCourses = 0;
  @Input() totalClassrooms = 0;
  @Input() totalEnrollments = 0;
  @Input() totalSchedules = 0;
}