import {Component} from '@angular/core';
import {SignUpForm} from '../../../iam/presentation/views/sign-up-form/sign-up-form';
import {LanguageSwitcher} from '../../../shared/presentation/components/language-switcher/language-switcher';
import {RouterModule} from '@angular/router';
import {CardModule} from 'primeng/card';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [
    SignUpForm,
    LanguageSwitcher,
    RouterModule,
    TranslateModule,
    CardModule
  ],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.scss'
})
export class SignUpPage {}