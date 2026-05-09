import {ClassSession} from './class-session.entity';

export interface Schedule {
  id: number;
  name: string;
  classSessions: ClassSession[];
}
