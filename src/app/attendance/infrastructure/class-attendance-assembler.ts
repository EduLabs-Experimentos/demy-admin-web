import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ClassAttendance, AttendanceRecord, AttendanceStatus } from '../domain/model/class-attendance.entity';
import { ClassAttendanceResource, ClassAttendancesResponse } from './class-attendance-response';

export class ClassAttendanceAssembler
  implements BaseAssembler<ClassAttendance, ClassAttendanceResource, ClassAttendancesResponse> {

  toEntitiesFromResponse(response: ClassAttendancesResponse): ClassAttendance[] {
    return response.attendances.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: ClassAttendanceResource): ClassAttendance {
    return new ClassAttendance({
      id: resource.id,
      classSessionId: resource.classSessionId,
      date: resource.date,
      attendance: resource.attendance.map(r => ({
        dni: r.dni,
        status: r.status as AttendanceStatus
      })) as AttendanceRecord[]
    });
  }

  toResourceFromEntity(entity: ClassAttendance): ClassAttendanceResource {
    return {
      id: entity.id,
      classSessionId: entity.classSessionId,
      date: entity.date,
      attendance: entity.attendance.map(r => ({ dni: r.dni, status: r.status }))
    };
  }
}
