import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'language'
})
export class LanguagePipe implements PipeTransform {

  constructor(public translate: TranslateService) {

  }

  transform(value: string) {
    if (value === 'da') {
      return 'DARI';
    }
    if (value === 'en') {
      return 'ENGLISH';
    }
  }

}
