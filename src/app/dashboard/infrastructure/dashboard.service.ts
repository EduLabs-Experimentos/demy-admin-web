import { Injectable, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StudentsApi } from '../../students/infrastructure/students-api';
import { TeacherApi } from '../../teachers/infrastructure/teacher-api';
import { CourseApi } from '../../courses/infrastructure/course-api';
import { ClassroomApi } from '../../classrooms/infrastructure/classroom-api';
import { EnrollmentApi } from '../../enrollments/infrastructure/enrollment-api';
import { ScheduleApi } from '../../schedules/infrastructure/schedule-api';
import { TransactionApi } from '../../accounting/infrastructure/transaction-api';
import { IamStore } from '../../iam/application/iam.store';
import {
  DashboardStats,
  TransactionSummary,
  ChartData,
  ExpenseByCategory,
  EnrollmentTrend,
  CourseCategoryCount
} from '../domain/model/dashboard-stats';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly studentsApi = inject(StudentsApi);
  private readonly teacherApi = inject(TeacherApi);
  private readonly courseApi = inject(CourseApi);
  private readonly classroomApi = inject(ClassroomApi);
  private readonly enrollmentApi = inject(EnrollmentApi);
  private readonly scheduleApi = inject(ScheduleApi);
  private readonly transactionApi = inject(TransactionApi);
  private readonly iamStore = inject(IamStore);

  fetchDashboardData() {
    return forkJoin({
      academy: new Promise<{ name: string }>((resolve) => {
        const academy = this.iamStore.currentAcademy();
        resolve({ name: academy?.name ?? 'Mi Academia' });
      }),
      students: this.studentsApi.getStudents(),
      teachers: this.teacherApi.getAll(),
      courses: this.courseApi.getAll(),
      classrooms: this.classroomApi.getAll(),
      enrollments: this.enrollmentApi.getAll(),
      schedules: this.scheduleApi.getAll(),
      transactions: this.transactionApi.getAll()
    });
  }

  processDashboardData(data: {
    academy: { name: string };
    students: any[];
    teachers: any[];
    courses: any[];
    classrooms: any[];
    enrollments: any[];
    schedules: any[];
    transactions: any[];
  }): {
    stats: DashboardStats;
    chartData: {
      incomeExpenseChart: ChartData;
      expenseCategories: ExpenseByCategory[];
      enrollmentTrend: EnrollmentTrend[];
      coursesByCategory: CourseCategoryCount[];
    };
    recentTransactions: TransactionSummary[];
  } {
    const { academy, students, teachers, courses, classrooms, enrollments, schedules, transactions } = data;

    const totalIncome = transactions
      .filter((t: any) => t.transactionType === 'INCOME')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const totalExpense = transactions
      .filter((t: any) => t.transactionType === 'EXPENSE')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

    const stats: DashboardStats = {
      academyName: academy.name,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalCourses: courses.length,
      totalClassrooms: classrooms.length,
      totalEnrollments: enrollments.length,
      totalSchedules: schedules.length,
      pendingPayments: 0,
      paidPayments: 0
    };

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();

    const incomeByMonth: number[] = [];
    const expenseByMonth: number[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i <= currentMonth; i++) {
      const monthStr = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
      const monthTransactions = transactions.filter((t: any) => {
        return t.transactionDate && t.transactionDate.startsWith(monthStr);
      });
      incomeByMonth.push(monthTransactions.filter((t: any) => t.transactionType === 'INCOME').reduce((s: number, t: any) => s + parseFloat(t.amount), 0));
      expenseByMonth.push(monthTransactions.filter((t: any) => t.transactionType === 'EXPENSE').reduce((s: number, t: any) => s + parseFloat(t.amount), 0));
    }

    const incomeExpenseChart: ChartData = {
      labels: monthNames.slice(0, currentMonth + 1),
      income: incomeByMonth,
      expense: expenseByMonth
    };

    const categoryMap = new Map<string, number>();
    transactions.filter((t: any) => t.transactionType === 'EXPENSE').forEach((t: any) => {
      const cat = t.transactionCategory || 'OTHER';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + parseFloat(t.amount));
    });

    const categoryColors: Record<string, string> = {
      TEACHER_SALARY: '#3F51B5',
      MATERIAL_PURCHASE: '#F57C00',
      UTILITY_PAYMENT: '#AB47BC',
      RENT_PAYMENT: '#4CAF50',
      OFFICE_SUPPLIES: '#F44336',
      OTHER: '#9E9E9E'
    };

    const expenseCategories: ExpenseByCategory[] = Array.from(categoryMap.entries()).map(([cat, amount]) => ({
      category: cat,
      amount,
      color: categoryColors[cat] || '#9E9E9E'
    }));

    const enrollmentTrend: EnrollmentTrend[] = monthNames.slice(0, currentMonth + 1).map((month, i) => ({
      month,
      count: Math.floor(enrollments.length * (0.1 + (i / (currentMonth || 1)) * 0.9))
    }));

    const courseCategories = ['Matemáticas', 'Idiomas', 'Ciencias', 'Arte', 'Deportes'];
    const coursesByCategory: CourseCategoryCount[] = courseCategories.map((cat, i) => ({
      category: cat,
      count: Math.floor(courses.length / courseCategories.length) + (i === 0 ? courses.length % courseCategories.length : 0)
    }));

    const recentTransactions: TransactionSummary[] = transactions
      .map((t: any) => ({
        id: t.id,
        description: t.description || t.transactionCategory,
        amount: parseFloat(t.amount),
        type: t.transactionType as 'INCOME' | 'EXPENSE',
        date: t.transactionDate,
        status: 'COMPLETED'
      }))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      stats,
      chartData: {
        incomeExpenseChart,
        expenseCategories,
        enrollmentTrend,
        coursesByCategory
      },
      recentTransactions
    };
  }
}