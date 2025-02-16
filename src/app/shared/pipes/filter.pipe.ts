import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(
    value: any[],
    gender: string,
    category: string,
    priceRange: string
  ): any[] {
    if (!value || value.length === 0) {
      return [];
    }

    let filtered = value;

    // Apply gender filter if specified
    if (gender && gender !== '') {
      filtered = filtered.filter((item) => item.category === gender);
    }

    // Apply category filter if specified
    if (category && category !== '') {
      filtered = filtered.filter((item) => item.subcategory === category);
    }

    // Apply price range filter if specified
    if (priceRange && priceRange !== '') {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      filtered = filtered.filter((item) => {
        const price = item.price;
        return maxPrice
          ? price >= minPrice && price <= maxPrice
          : price >= minPrice;
      });
    }

    return filtered;
  }
}
