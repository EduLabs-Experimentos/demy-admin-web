export interface ClassSessionCourseInfo {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface ClassSessionClassroomInfo {
  id: number;
  code: string;
  capacity: number;
  campus: string;
}

export interface ClassSessionTeacherInfo {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
}

export interface ClassSession {
  id: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  course: ClassSessionCourseInfo;
  classroom: ClassSessionClassroomInfo;
  teacher: ClassSessionTeacherInfo;
}
