/**
 * Request interface for verify user account API calls.
 */
export interface VerifyRequest {
  email: string;
  code: string;
}