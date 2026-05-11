import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'demy-web-app';

  private translate = inject(TranslateService);

  constructor() {
    const savedLang = localStorage.getItem('app-lang');
    const browserLang = this.translate.getBrowserLang();
    const langToUse = savedLang || (browserLang?.match(/en|es/) ? browserLang : 'en');

    this.translate.addLangs(['en', 'es']);
    this.translate.setFallbackLang('en');

    firstValueFrom(this.translate.get(langToUse)).then(() => {
      this.translate.use(langToUse);
    }).catch(() => {
      this.translate.use('en');
    });
  }
}
