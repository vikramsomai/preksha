import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../core/services/category/category.service';
import { MatDialog } from '@angular/material/dialog';
import { AddSubCategoryComponent } from './add-sub-category/add-sub-category.component';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './subcategory.component.html',
  styleUrl: './subcategory.component.scss',
})
export class SubcategoryComponent {
  readonly dialog = inject(MatDialog);
  categoryData: any[] = [];
  http=inject(HttpClient)
  constructor(private catgoryService: CategoryService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.catgoryService.subCategories$.subscribe((res) => {
      this.categoryData = res;
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddSubCategoryComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  deleteProduct(id: any) {
    this.catgoryService.deleteSubCategoryById(id).subscribe({
      next: (response) => {
        console.log('Category deleted successfully:', response);
      },
      error: (err) => {
        console.error('Error deleting category:', err);
      },
    });
  }
}
