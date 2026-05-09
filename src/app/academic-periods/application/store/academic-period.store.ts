import {Injectable, signal} from '@angular/core';
import {AcademicPeriod} from '../../domain/model/academic-period.entity';
import {AcademicPeriodFormData} from '../../domain/model/academic-period-form-data';
import {GetAcademicPeriodsService} from '../services/get-academic-periods.service';
import {CreateAcademicPeriodService} from '../services/create-academic-period.service';
import {UpdateAcademicPeriodService} from '../services/update-academic-period.service';
import {DeleteAcademicPeriodService} from '../services/delete-academic-period.service';
import {CreateAcademicPeriodRequest, UpdateAcademicPeriodRequest} from '../../infrastructure/academic-period-request';

@Injectable({providedIn: 'root'})
export class AcademicPeriodStore {
  private readonly periodsSignal = signal<AcademicPeriod[]>([]);
  private readonly filteredPeriodsSignal = signal<AcademicPeriod[]>([]);
  private readonly isLoadingPeriodsSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly isDeletingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly formDataSignal = signal<AcademicPeriodFormData>({
    periodName: '',
    startDate: '',
    endDate: '',
    isActive: true
  });
  private readonly searchQuerySignal = signal<string>('');
  private readonly selectedPeriodIdSignal = signal<number | null>(null);

  readonly periods = this.periodsSignal.asReadonly();
  readonly filteredPeriods = this.filteredPeriodsSignal.asReadonly();
  readonly isLoadingPeriods = this.isLoadingPeriodsSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isDeleting = this.isDeletingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly formData = this.formDataSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly selectedPeriodId = this.selectedPeriodIdSignal.asReadonly();
  readonly isEditing = () => this.selectedPeriodIdSignal() !== null;

  constructor(
    private readonly getPeriodsService: GetAcademicPeriodsService,
    private readonly createPeriodService: CreateAcademicPeriodService,
    private readonly updatePeriodService: UpdateAcademicPeriodService,
    private readonly deletePeriodService: DeleteAcademicPeriodService
  ) {}

  loadPeriods(): void {
    this.isLoadingPeriodsSignal.set(true);
    this.getPeriodsService.execute().subscribe({
      next: (periods) => {
        this.periodsSignal.set(periods);
        this.applyFilter(this.searchQuerySignal());
        this.isLoadingPeriodsSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to load academic periods');
        this.isLoadingPeriodsSignal.set(false);
      }
    });
  }

  createPeriod(): void {
    const data = this.formDataSignal();
    if (!data.periodName || !data.startDate || !data.endDate) {
      this.errorSignal.set('Name, start date and end date are required');
      return;
    }
    if (data.startDate > data.endDate) {
      this.errorSignal.set('Start date must be before end date');
      return;
    }

    const request: CreateAcademicPeriodRequest = {
      periodName: data.periodName,
      startDate: data.startDate,
      endDate: data.endDate
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.createPeriodService.execute(request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadPeriods();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to create academic period');
        this.isLoadingSignal.set(false);
      }
    });
  }

  updatePeriod(): void {
    const periodId = this.selectedPeriodIdSignal();
    const data = this.formDataSignal();
    if (!periodId) return;
    if (!data.periodName || !data.startDate || !data.endDate) {
      this.errorSignal.set('Name, start date and end date are required');
      return;
    }

    const request: UpdateAcademicPeriodRequest = {
      periodName: data.periodName,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive
    };

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);
    this.updatePeriodService.execute(periodId, request).subscribe({
      next: () => {
        this.isLoadingSignal.set(false);
        this.resetForm();
        this.loadPeriods();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to update academic period');
        this.isLoadingSignal.set(false);
      }
    });
  }

  deletePeriod(periodId: number): void {
    this.isDeletingSignal.set(true);
    this.errorSignal.set(null);
    this.deletePeriodService.execute(periodId).subscribe({
      next: () => {
        this.isDeletingSignal.set(false);
        if (this.selectedPeriodIdSignal() === periodId) this.resetForm();
        this.loadPeriods();
      },
      error: (err) => {
        this.errorSignal.set(err?.error?.message || err?.message || 'Failed to delete academic period');
        this.isDeletingSignal.set(false);
      }
    });
  }

  editPeriod(period: AcademicPeriod): void {
    this.selectedPeriodIdSignal.set(period.id);
    this.formDataSignal.set({
      periodName: period.periodName,
      startDate: period.startDate,
      endDate: period.endDate,
      isActive: period.isActive
    });
    this.errorSignal.set(null);
  }

  cancelEdit(): void { this.resetForm(); }

  onFieldChange(field: keyof AcademicPeriodFormData, value: string): void {
    this.formDataSignal.update(data => ({ ...data, [field]: value }));
  }

  onIsActiveChange(value: boolean): void {
    this.formDataSignal.update(data => ({ ...data, isActive: value }));
  }

  onSearchQueryChange(query: string): void {
    this.searchQuerySignal.set(query);
    this.applyFilter(query);
  }

  clearError(): void { this.errorSignal.set(null); }

  private resetForm(): void {
    this.formDataSignal.set({ periodName: '', startDate: '', endDate: '', isActive: true });
    this.selectedPeriodIdSignal.set(null);
  }

  private applyFilter(query: string): void {
    const periods = this.periodsSignal();
    this.filteredPeriodsSignal.set(
      query.trim() ? periods.filter(p => p.periodName.toLowerCase().includes(query.toLowerCase())) : periods
    );
  }
}
