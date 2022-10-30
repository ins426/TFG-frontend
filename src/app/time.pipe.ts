import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: string | null): string | void {
    if(value){
      let tokens = value.split(":").slice(0)
      return tokens[0]+":"+tokens[1]
    }
  }

}
