import { Injectable, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StudentsApi } from '../../students/infrastructure/students-api';
import { TeacherApi } from '../../teachers/infrastructure/teacher-api';
import { CourseApi } from '../../courses/infrastructure/course-api';
import { ClassroomApi } from '../../classrooms/infrastructure/classroom-api';
import { EnrollmentApi } from '../../enrollments/infrastructure/enrollment-api';
import { ScheduleApi } from '../../schedules/infrastructure/schedule-api';
import { BillingApi } from '../../billing/infrastructure/billing-api';
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
  private readonly billingApi = inject(BillingApi);
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
      billingAccounts: this.billingApi.getAllBillingAccounts()
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
    billingAccounts: any[];
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
    const { academy, students, teachers, courses, classrooms, enrollments, schedules, billingAccounts } = data;

    const totalIncome = billingAccounts.reduce((sum: number, acc: any) => {
      return sum + acc.invoices
        .filter((inv: any) => inv.invoiceType === 'INCOME' && inv.status === 'PAID')
        .reduce((s: number, inv: any) => s + parseFloat(inv.amount), 0);
    }, 0);

    const totalExpense = billingAccounts.reduce((sum: number, acc: any) => {
      return sum + acc.invoices
        .filter((inv: any) => inv.invoiceType === 'EXPENSE')
        .reduce((s: number, inv: any) => s + parseFloat(inv.amount), 0);
    }, 0);

    const pendingPayments = billingAccounts.reduce((count: number, acc: any) => {
      return count + acc.invoices.filter((inv: any) => inv.status === 'PENDING').length;
    }, 0);

    const paidPayments = billingAccounts.reduce((count: number, acc: any) => {
      return count + acc.invoices.filter((inv: any) => inv.status === 'PAID').length;
    }, 0);

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
      pendingPayments,
      paidPayments
    };

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const incomeExpenseChart: ChartData = {
      labels: monthNames.slice(0, currentMonth + 1),
      income: monthNames.slice(0, currentMonth + 1).map(() => Math.floor(Math.random() * 5000) + 1000),
      expense: monthNames.slice(0, currentMonth + 1).map(() => Math.floor(Math.random() * 3000) + 500)
    };

    const expenseCategories: ExpenseByCategory[] = [
      { category: 'Personal', amount: Math.floor(totalExpense * 0.4), color: '#3F51B5' },
      { category: 'Infraestructura', amount: Math.floor(totalExpense * 0.25), color: '#F57C00' },
      { category: 'Marketing', amount: Math.floor(totalExpense * 0.15), color: '#AB47BC' },
      { category: 'Servicios', amount: Math.floor(totalExpense * 0.12), color: '#4CAF50' },
      { category: 'Otros', amount: Math.floor(totalExpense * 0.08), color: '#9E9E9E' }
    ];

    const enrollmentTrend: EnrollmentTrend[] = monthNames.slice(0, currentMonth + 1).map((month, i) => ({
      month,
      count: Math.floor(enrollments.length * (0.1 + (i / currentMonth) * 0.9))
    }));

    const courseCategories = ['Matemáticas', 'Idiomas', 'Ciencias', 'Arte', 'Deportes'];
    const coursesByCategory: CourseCategoryCount[] = courseCategories.map((cat, i) => ({
      category: cat,
      count: Math.floor(courses.length / courseCategories.length) + (i === 0 ? courses.length % courseCategories.length : 0)
    }));

    const recentTransactions: TransactionSummary[] = billingAccounts
      .flatMap((acc: any) => acc.invoices.map((inv: any) => ({
        id: inv.id,
        description: inv.description || inv.invoiceType,
        amount: parseFloat(inv.amount),
        type: inv.invoiceType as 'INCOME' | 'EXPENSE',
        date: inv.issueDate,
        status: inv.status
      })))
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