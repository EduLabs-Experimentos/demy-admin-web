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
      emailAddress: resource.email || resource.emailAddress || 'Sin correo',
      sex: resource.sex,
      birthDate: new Date(resource.birthDate),
      // Tomamos el que venga, priorizando 'phone'
      phone: resource.phone || resource.phoneNumber || '',
      studentCode: resource.studentCode,
      street: resource.street,
      district: resource.district,
      province: resource.province,
      department: resource.department,
      countryCode: resource.countryCode
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
      phoneNumber: entity.phone,
      studentCode: entity.studentCode,
      street: entity.street,
      district: entity.district,
      province: entity.province,
      department: entity.department,
      countryCode: entity.countryCode
    } as StudentResource;
  }
}
