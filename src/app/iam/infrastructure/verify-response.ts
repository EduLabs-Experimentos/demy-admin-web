import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource interface for verify account operations.
 */
export interface VerifyResource extends BaseResource {
  id: number;
  email: string;
  token: string;
  roles: string[];
}

/**
 * Response interface for verify account API calls.
 */
export interface VerifyResponse extends BaseResponse, VerifyResource {}