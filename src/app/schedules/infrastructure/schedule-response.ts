import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface ScheduleCourseResource {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface ScheduleClassroomResource {
  id: number;
  code: string;
  capacity: number;
  campus: string;
}

export interface ScheduleTeacherResource {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  countryCode: string;
  phoneNumber: string;
  academyId: number;
}

export interface ScheduleResource extends BaseResource {
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  course: ScheduleCourseResource;
  classroom: ScheduleClassroomResource;
  teacher: ScheduleTeacherResource;
}

export interface WeeklyScheduleResource extends BaseResource {
  name: string;
  classSessions: ScheduleResource[];
}

export interface WeeklyScheduleResponse extends BaseResponse, WeeklyScheduleResource {}

export interface ScheduleResponse extends BaseResponse, ScheduleResource {}
