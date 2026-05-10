export interface Enrollment {
  id: number;
  studentId: number;
  periodId: number;
  scheduleId: number;
  academyId: number;
  amount: number;
  currency: string;
  enrollmentStatus: string;
  paymentStatus: string;
}
