import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productFilter',
  standalone: true
})
export class ProductFilterPipe implements PipeTransform {

  transform(value: any[], args:any[]): any[] {
    if(args.length!=0)
      return value.filter(item=>item.includes(args))
    return value;
  }

}
