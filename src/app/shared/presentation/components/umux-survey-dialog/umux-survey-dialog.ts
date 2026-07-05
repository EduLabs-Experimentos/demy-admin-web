import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ApplicationInsightsService } from '../../../infrastructure/analytics/application-insights.service';

export interface UmuxSurveyContext {
  flow: string;
  academyId?: number | string;
}

@Component({
  selector: 'app-umux-survey-dialog',
  standalone: true,
  imports: [ButtonModule, TranslateModule],
  templateUrl: './umux-survey-dialog.html',
  styleUrl: './umux-survey-dialog.scss',
})
export class UmuxSurveyDialog implements OnChanges {
  @Input() visible = false;
  @Input() context: UmuxSurveyContext | null = null;
  @Output() dismissed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  private readonly analytics = inject(ApplicationInsightsService);

  protected readonly scoreOptions = [1, 2, 3, 4, 5];
  protected scoreUsability: number | null = null;
  protected scoreUtility: number | null = null;

  protected get titleKey(): string {
    switch (this.context?.flow) {
      case 'enrollment_registration':
        return 'umuxSurvey.title.enrollment';
      case 'billing_invoice_create':
        return 'umuxSurvey.title.billing';
      case 'accounting_transaction_create':
        return 'umuxSurvey.title.accounting';
      default:
        return 'umuxSurvey.title.default';
    }
  }

  protected get shouldShow(): boolean {
    return this.visible && !!this.context && !this.wasAnswered(this.context.flow);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['visible'] || changes['context']) && this.visible && this.context && this.wasAnswered(this.context.flow)) {
      queueMicrotask(() => this.dismissed.emit());
    }
  }

  protected selectUsability(score: number): void {
    this.scoreUsability = score;
  }

  protected selectUtility(score: number): void {
    this.scoreUtility = score;
  }

  protected submit(): void {
    if (!this.context || !this.scoreUsability || !this.scoreUtility) return;

    this.analytics.trackUmuxSurveyRespond({
      ...this.context,
      scoreUsability: this.scoreUsability,
      scoreUtility: this.scoreUtility,
    });
    this.markAsAnswered(this.context.flow);
    this.reset();
    this.submitted.emit();
  }

  protected dismiss(): void {
    if (this.context) this.markAsAnswered(this.context.flow);
    this.reset();
    this.dismissed.emit();
  }

  private reset(): void {
    this.scoreUsability = null;
    this.scoreUtility = null;
  }

  private wasAnswered(flow: string): boolean {
    return localStorage.getItem(this.getStorageKey(flow)) === 'true';
  }

  private markAsAnswered(flow: string): void {
    localStorage.setItem(this.getStorageKey(flow), 'true');
  }

  private getStorageKey(flow: string): string {
    return `umux_survey_answered_${flow}`;
  }
}
