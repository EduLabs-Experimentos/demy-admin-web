import {Component} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageSwitcher} from '../../../shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-plan-select-page',
  standalone: true,
  imports: [RouterModule, TranslateModule, ButtonModule, CardModule, LanguageSwitcher],
  templateUrl: './plan-select-page.html',
  styleUrl: './plan-select-page.scss'
})
export class PlanSelectPage {
  protected selectedPlan: string | null = null;

  constructor(private router: Router) {}

  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }

  continue() {
    if (!this.selectedPlan) return;
    localStorage.setItem('selectedPlan', this.selectedPlan);
    this.router.navigate(['/sign-up']).then();
  }
}
