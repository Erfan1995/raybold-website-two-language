import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'language'
})
export class LanguagePipe implements PipeTransform {

  constructor(public translate: TranslateService) {

  }

  transform(value: string) {
    if (value === 'dr') {
      return 'HEADER.DARI';
    }
    if (value === 'en') {
      return 'HEADER.ENGLISH';
    }
  }

}
