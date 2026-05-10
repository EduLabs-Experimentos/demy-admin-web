export interface CreateEnrollmentRequest {
  studentId: number;
  periodId: number;
  scheduleId: number;
  amount: string;
  currency: string;
  paymentStatus: string;
}

export interface UpdateEnrollmentRequest {
  amount: string;
  currency: string;
  enrollmentStatus: string;
  paymentStatus: string;
}
