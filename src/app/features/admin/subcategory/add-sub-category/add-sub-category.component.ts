import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { CategoryService } from '../../../../core/services/category/category.service';

@Component({
  selector: 'app-add-sub-category',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogClose, MatDialogModule, JsonPipe],
  templateUrl: './add-sub-category.component.html',
  styleUrl: './add-sub-category.component.scss',
})
export class AddSubCategoryComponent {
  categoryForm = new FormGroup({
    category: new FormControl(''),
  });
  constructor(private categoryService: CategoryService) {}

  addCatgory() {
    this.categoryService
      .addSubCategory(this.categoryForm.value)
      .subscribe((res) => {});
  }
}
