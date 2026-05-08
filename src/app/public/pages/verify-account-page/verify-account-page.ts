import {Component} from '@angular/core';
import {VerifyAccountForm} from './verify-account-form';
import {LanguageSwitcher} from '../../../shared/presentation/components/language-switcher/language-switcher';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-verify-account-page',
  standalone: true,
  imports: [
    VerifyAccountForm,
    LanguageSwitcher,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './verify-account-page.html',
  styleUrl: './verify-account-page.scss'
})
export class VerifyAccountPage {}