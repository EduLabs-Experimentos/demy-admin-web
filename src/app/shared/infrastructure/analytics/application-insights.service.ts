import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from '../../../../environments/environment';

export interface UmuxSurveyTelemetry {
  flow: string;
  academyId?: number | string;
  scoreUsability: number;
  scoreUtility: number;
}

@Injectable({ providedIn: 'root' })
export class ApplicationInsightsService {
  private readonly appInsights: ApplicationInsights | null = this.createClient();

  trackUmuxSurveyRespond(telemetry: UmuxSurveyTelemetry): void {
    const academyId = telemetry.academyId?.toString() ?? localStorage.getItem('academyId') ?? 'unknown';
    const payload = {
      event: 'umux_survey_respond',
      academy_id: academyId,
      flow: telemetry.flow,
      score_usability: telemetry.scoreUsability,
      score_utility: telemetry.scoreUtility,
    };

    console.log('[ApplicationInsights]', payload);
    this.appInsights?.trackEvent({
      name: 'umux_survey_respond',
      properties: payload,
    });
  }

  private createClient(): ApplicationInsights | null {
    const connectionString = environment.applicationInsightsConnectionString.trim();
    if (!connectionString) return null;

    const client = new ApplicationInsights({
      config: {
        connectionString,
        enableAutoRouteTracking: true,
      },
    });
    client.loadAppInsights();
    return client;
  }
}
