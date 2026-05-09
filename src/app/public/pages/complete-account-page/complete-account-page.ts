import {Component} from '@angular/core';
import {CompleteAccountForm} from './complete-account-form';
import {LanguageSwitcher} from '../../../shared/presentation/components/language-switcher/language-switcher';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-complete-account-page',
  standalone: true,
  imports: [
    CompleteAccountForm,
    LanguageSwitcher,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './complete-account-page.html',
  styleUrl: './complete-account-page.scss'
})
export class CompleteAccountPage {}