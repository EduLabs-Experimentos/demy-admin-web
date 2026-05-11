import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface AdminRegisterResource extends BaseResource {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dniNumber: string;
  academyId: number;
  userId: number;
}

export interface AdminRegisterResponse extends BaseResponse, AdminRegisterResource {}
