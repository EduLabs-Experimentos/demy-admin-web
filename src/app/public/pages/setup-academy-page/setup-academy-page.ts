import {Component} from '@angular/core';
import {SetupAcademyForm} from './setup-academy-form';
import {LanguageSwitcher} from '../../../shared/presentation/components/language-switcher/language-switcher';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-setup-academy-page',
  standalone: true,
  imports: [
    SetupAcademyForm,
    LanguageSwitcher,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './setup-academy-page.html',
  styleUrl: './setup-academy-page.scss'
})
export class SetupAcademyPage {}