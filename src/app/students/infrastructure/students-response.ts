import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface StudentResource extends BaseResource {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  emailAddress: string;
  sex: string;
  birthDate: string; // ISO string format is usually best for REST
  street?: string;
  district?: string;
  province?: string;
  department?: string;
  countryCode?: string;
  phone: string;
  studentCode?: string;
}

export interface CreateStudentResource {
  firstName: string;
  lastName: string;
  dni: string;
  emailAddress: string;
  sex: string;
  birthDate: string;
  phone: string;
  // Agrega los campos de dirección si el backend los requiere en la creación
}

export interface UpdateStudentResource extends CreateStudentResource {
  // Aquí puedes extender si la actualización requiere campos distintos
}

// Opcional: Si tu endpoint getAll() devuelve un objeto con un array dentro, usa esto.
// Si devuelve un array directamente (como veo en tu controlador: ResponseEntity<List<StudentResource>>),
// el BaseApiEndpoint de tu ejemplo ya lo maneja.
export interface StudentsResponse extends BaseResponse {
  students: StudentResource[];
}
