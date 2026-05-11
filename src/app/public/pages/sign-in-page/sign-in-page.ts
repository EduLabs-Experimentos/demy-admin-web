import {Component} from '@angular/core';
import {SignInForm} from '../../../iam/presentation/views/sign-in-form/sign-in-form';
import {LanguageSwitcher} from '../../../shared/presentation/components/language-switcher/language-switcher';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [
    SignInForm,
    LanguageSwitcher,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.scss'
})
export class SignInPage {}
