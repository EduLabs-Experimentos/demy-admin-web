/**
 * Request interface for registering an academy.
 */
export interface AcademyRegisterRequest {
  academyName: string;
  academyDescription: string;
  street: string;
  district: string;
  province: string;
  department: string;
  emailAddress: string;
  countryCode: string;
  phone: string;
  ruc: string;
  administratorId: number;
}