import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface TeacherResource extends BaseResource {
  firstName: string;
  lastName: string;
  emailAddress: string;
  countryCode: string;
  phoneNumber: string;
  academyId: number;
}

export interface TeacherResponse extends BaseResponse, TeacherResource {}
