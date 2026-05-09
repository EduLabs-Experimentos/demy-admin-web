import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface ClassroomResource extends BaseResource {
  code: string;
  capacity: number;
  campus: string;
}

export interface ClassroomResponse extends BaseResponse, ClassroomResource {}
