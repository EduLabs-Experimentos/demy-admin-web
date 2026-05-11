import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface EnrollmentResource extends BaseResource {
  studentId: number;
  periodId: number;
  scheduleId: number;
  academyId: number;
  amount: number;
  currency: string;
  enrollmentStatus: string;
  paymentStatus: string;
}

export interface EnrollmentResponse extends BaseResponse, EnrollmentResource {}

export interface EnrollmentPeriodReference {
  id: number;
  periodName: string;
}

export interface EnrollmentScheduleReference {
  id: number;
  name: string;
}
