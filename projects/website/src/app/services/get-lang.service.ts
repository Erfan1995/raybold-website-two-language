import {Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class GetLangService {

  constructor(public translate: TranslateService) {
  }

  getLang() {
    const lang = localStorage.getItem('lang');
    if (lang) {
      return lang;
    } else {
      return this.translate.getBrowserLang();
    }
  }

  setDefaultLang() {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translate.setDefaultLang(lang);
    } else {
      this.translate.setDefaultLang('en');
    }
  }

  configLang() {
    this.translate.addLangs(['en', 'da']);
    this.setDefaultLang();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem('lang', event.lang);
    });
    this.translate.use(this.getLang());
  }
}
