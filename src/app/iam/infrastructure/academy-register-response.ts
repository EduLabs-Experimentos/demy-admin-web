import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface AcademyRegisterResource extends BaseResource {
  id: number;
  administratorId: number;
  academyName: string;
  academyDescription: string;
  street: string;
  district: string;
  province: string;
  department: string;
  emailAddress: string;
  phoneNumber: string;
  ruc: string;
}

export interface AcademyRegisterResponse extends BaseResponse, AcademyRegisterResource {}
