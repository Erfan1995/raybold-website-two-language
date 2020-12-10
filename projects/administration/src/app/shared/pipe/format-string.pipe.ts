import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatString'
})
export class FormatStringPipe implements PipeTransform {

  transform(data: any): any {
    if (data.length > 190) {
      return data.substr(0, 180) + '</p>';
    }
    return data;
  }

}
