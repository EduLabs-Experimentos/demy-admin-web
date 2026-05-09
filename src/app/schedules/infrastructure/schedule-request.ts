export interface CreateWeeklyScheduleRequest {
  name: string;
}

export interface UpdateWeeklyScheduleNameRequest {
  name: string;
}

export interface AddScheduleToWeeklyRequest {
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  courseId: number;
  classroomId: number;
  teacherFirstName: string;
  teacherLastName: string;
}

export interface UpdateScheduleRequest {
  classroomId: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
}
