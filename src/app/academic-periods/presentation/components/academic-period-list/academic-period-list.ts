import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TranslateModule} from '@ngx-translate/core';
import {AcademicPeriodStore} from '../../../application/store/academic-period.store';

@Component({
  selector: 'app-academic-period-list',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, TranslateModule],
  templateUrl: './academic-period-list.html',
  styleUrl: './academic-period-list.scss'
})
export class AcademicPeriodList implements OnInit {
  protected readonly store = inject(AcademicPeriodStore);

  ngOnInit(): void { this.store.loadPeriods(); }

  editPeriod(periodId: number): void {
    const period = this.store.periods().find(p => p.id === periodId);
    if (period) this.store.editPeriod(period);
  }

  deletePeriod(periodId: number): void { this.store.deletePeriod(periodId); }
}
