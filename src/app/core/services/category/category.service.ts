import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;
  constructor() {}
  http = inject(HttpClient);

  addCategory(category: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/category/add-category`, category);
  }
  fectchCategory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/all`);
  }
  addSubCategory(subCategory: any) {
    return this.http.post(
      `${this.baseUrl}/category/add-subCategory`,
      subCategory
    );
  }
  fetchSubCategory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/subcategory`);
  }
}
