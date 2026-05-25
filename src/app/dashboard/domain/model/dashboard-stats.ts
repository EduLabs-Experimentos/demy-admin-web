export interface DashboardStats {
  academyName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClassrooms: number;
  totalEnrollments: number;
  totalSchedules: number;
  pendingPayments: number;
  paidPayments: number;
}

export interface TransactionSummary {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  status: string;
}

export interface ChartData {
  labels: string[];
  income: number[];
  expense: number[];
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
  color: string;
}

export interface EnrollmentTrend {
  month: string;
  count: number;
}

export interface CourseCategoryCount {
  category: string;
  count: number;
}

export interface DashboardUiState {
  loading: boolean;
  error: string | null;
  stats: DashboardStats | null;
  chartData: {
    incomeExpenseChart: ChartData;
    expenseCategories: ExpenseByCategory[];
    enrollmentTrend: EnrollmentTrend[];
    coursesByCategory: CourseCategoryCount[];
  } | null;
  recentTransactions: TransactionSummary[];
}