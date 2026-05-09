import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface AcademicPeriodResource extends BaseResource {
  periodName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  academyId: number;
}

export interface AcademicPeriodResponse extends BaseResponse, AcademicPeriodResource {}
