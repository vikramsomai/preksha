import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.apiUrl;
  http = inject(HttpClient);

  private categoriesSubject = new BehaviorSubject<any[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  private subCategoriesSubject = new BehaviorSubject<any[]>([]);
  subCategories$ = this.subCategoriesSubject.asObservable();

  constructor() {
    this.fetchCategories();
    this.fetchSubCategories();
  }

  private fetchCategories() {
    this.http.get<any[]>(`${this.baseUrl}/category/all`).subscribe((data) => {
      this.categoriesSubject.next(data);
    });
  }

  private fetchSubCategories() {
    this.http
      .get<any[]>(`${this.baseUrl}/category/subcategory`)
      .subscribe((data) => {
        this.subCategoriesSubject.next(data);
      });
  }

  addCategory(category: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/category/add-category`, category)
      .pipe(
        tap(() => this.fetchCategories()) // Fetch updated data after adding
      );
  }

  addSubCategory(subCategory: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/category/add-subCategory`, subCategory)
      .pipe(
        tap(() => this.fetchSubCategories()) // Fetch updated data after adding
      );
  }

  deleteCategoryById(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/category/delete/${id}`).pipe(
      tap(() => {
        let updatedCategories = this.categoriesSubject
          .getValue()
          .filter((cat) => cat._id !== id);
        this.categoriesSubject.next(updatedCategories); // Update categories in real-time
      })
    );
  }

  deleteSubCategoryById(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/category/sub/delete/${id}`).pipe(
      tap(() => {
        let updatedSubCategories = this.subCategoriesSubject
          .getValue()
          .filter((sub) => sub._id !== id);
        this.subCategoriesSubject.next(updatedSubCategories); // Update subcategories in real-time
      })
    );
  }
}
