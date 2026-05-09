export interface CreateAcademicPeriodRequest {
  periodName: string;
  startDate: string;
  endDate: string;
}

export interface UpdateAcademicPeriodRequest {
  periodName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
