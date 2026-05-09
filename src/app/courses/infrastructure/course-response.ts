import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface CourseResource extends BaseResource {
  name: string;
  code: string;
  description: string;
}

export interface CourseResponse extends BaseResponse, CourseResource {}
