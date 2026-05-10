export interface EnrollmentFormData {
  studentId: string;
  periodId: number | null;
  scheduleId: number | null;
  amount: string;
  currency: string;
  paymentStatus: string;
  enrollmentStatus: string;
}
