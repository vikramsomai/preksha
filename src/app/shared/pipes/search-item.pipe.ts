import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchItem',
  standalone: true,
})
export class SearchItemPipe implements PipeTransform {
  transform(items: any[], search: string): any[] {
    let filterItem: any[] = [];
    if (search != '') {
      return items.filter((item) =>
        item.productName.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filterItem;
  }
}
