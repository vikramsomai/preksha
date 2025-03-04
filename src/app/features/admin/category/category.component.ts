import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCatgoryComponent } from './add-catgory/add-catgory.component';
import { CategoryService } from '../../../core/services/category/category.service';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  readonly dialog = inject(MatDialog);
  categoryData: any[] = [];
  constructor(private catgoryService: CategoryService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.catgoryService.categories$.subscribe((res) => {
      this.categoryData = res;
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddCatgoryComponent);

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  deleteProduct(id: any) {
    this.catgoryService.deleteCategoryById(id).subscribe({
      next: (response) => {
      },
      error: (err) => {
      },
    });
  }
}
