import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface StudentResource extends BaseResource {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email?: string;
  emailAddress?: string;
  sex: string;
  birthDate: string;
  street: string;
  district: string;
  province: string;
  department: string;
  countryCode: string;
  phone: string;
  phoneNumber?: string; // <--- NUEVO: Lo que pide el backend para el PUT
  studentCode?: string;
  academyId?: number;
  userId?: number;
}

export interface CreateStudentResource {
  firstName: string;
  lastName: string;
  dni: string;
  emailAddress: string;
  sex: string;
  birthDate: string;
  phone: string;
  studentCode?: string;
  street: string;
  district: string;
  province: string;
  department: string;
  countryCode: string;
}

export interface UpdateStudentResource extends CreateStudentResource {}

export interface StudentsResponse extends BaseResponse {
  students: StudentResource[];
}
