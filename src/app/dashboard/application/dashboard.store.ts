import { computed, Injectable, signal } from '@angular/core';
import { DashboardService } from '../infrastructure/dashboard.service';
import {
  DashboardStats,
  ChartData,
  ExpenseByCategory,
  EnrollmentTrend,
  CourseCategoryCount,
  TransactionSummary
} from '../domain/model/dashboard-stats';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly service = new DashboardService();

  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly statsSignal = signal<DashboardStats | null>(null);
  private readonly chartDataSignal = signal<{
    incomeExpenseChart: ChartData;
    expenseCategories: ExpenseByCategory[];
    enrollmentTrend: EnrollmentTrend[];
    coursesByCategory: CourseCategoryCount[];
  } | null>(null);
  private readonly recentTransactionsSignal = signal<TransactionSummary[]>([]);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly stats = this.statsSignal.asReadonly();
  readonly chartData = this.chartDataSignal.asReadonly();
  readonly recentTransactions = this.recentTransactionsSignal.asReadonly();

  readonly hasData = computed(() => this.statsSignal() !== null);

  loadDashboard() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.service.fetchDashboardData().subscribe({
      next: (data) => {
        const result = this.service.processDashboardData(data);
        this.statsSignal.set(result.stats);
        this.chartDataSignal.set(result.chartData);
        this.recentTransactionsSignal.set(result.recentTransactions);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.loadingSignal.set(false);
      }
    });
  }

  refresh() {
    this.loadDashboard();
  }
}