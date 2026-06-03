import {Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss'
})
export class LanguageSwitcher {
  protected currentLang: string = 'es';
  protected languages: string[] = ['es', 'en'];

  private translate: TranslateService = inject(TranslateService);

  constructor() {
    const savedLang = localStorage.getItem('app-lang');
    if (savedLang && this.languages.includes(savedLang)) {
      this.currentLang = savedLang;
      this.translate.use(savedLang);
    } else {
      this.translate.setFallbackLang('es');
      this.translate.use('es');
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
    this.currentLang = language;
    localStorage.setItem('app-lang', language);
  }
}