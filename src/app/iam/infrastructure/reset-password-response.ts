import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface ResetPasswordResource extends BaseResource {
  id: number;
  emailAddress: string;
  token: string;
}

export interface ResetPasswordResponse extends BaseResponse, ResetPasswordResource {}
