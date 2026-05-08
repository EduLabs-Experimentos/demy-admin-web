/**
 * Request interface for registering an administrator.
 */
export interface AdminRegisterRequest {
  firstName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  dniNumber: string;
  userId: number;
}