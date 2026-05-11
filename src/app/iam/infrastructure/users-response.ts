import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface UserResource extends BaseResource {
  id: number;
  emailAddress: string;
}

export interface UsersResponse extends BaseResponse {
  users: UserResource[];
}
