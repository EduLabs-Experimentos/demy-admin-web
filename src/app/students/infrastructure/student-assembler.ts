import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Student } from '../domain/model/student.entity';
import { StudentResource, StudentsResponse } from './students-response';

export class StudentAssembler implements BaseAssembler<Student, StudentResource, StudentsResponse> {

  toEntitiesFromResponse(response: StudentsResponse): Student[] {
    return response.students.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: StudentResource): Student {
    return new Student({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      dni: resource.dni,
      emailAddress: resource.emailAddress,
      sex: resource.sex,
      // Parseamos el string que viene del backend a un objeto Date
      birthDate: new Date(resource.birthDate),
      phone: resource.phone,
      studentCode: resource.studentCode
    });
  }

  toResourceFromEntity(entity: Student): StudentResource {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      dni: entity.dni,
      emailAddress: entity.emailAddress,
      sex: entity.sex,
      birthDate: entity.birthDate.toISOString().split('T')[0],
      phone: entity.phone,
      studentCode: entity.studentCode,
      // Mapeamos los nuevos campos hacia el backend
      street: entity.street,
      district: entity.district,
      province: entity.province,
      department: entity.department,
      countryCode: entity.countryCode
    } as StudentResource;
  }
}
