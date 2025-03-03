import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialog,
  MatDialogClose,
  MatDialogModule,
} from '@angular/material/dialog';
import { CategoryService } from '../../../../core/services/category/category.service';
@Component({
  selector: 'app-add-catgory',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogClose, MatDialogModule, JsonPipe],
  templateUrl: './add-catgory.component.html',
  styleUrl: './add-catgory.component.scss',
})
export class AddCatgoryComponent {
  categoryForm = new FormGroup({
    category: new FormControl(''),
    // subcategory: new FormControl(''),
  });
  constructor(private categoryService: CategoryService) {}

  addCatgory() {
    this.categoryService
      .addCategory(this.categoryForm.value)
      .subscribe((res) => {});
  }
}
