import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCatgoryComponent } from './add-catgory/add-catgory.component';
import { CategoryService } from '../../../core/services/category/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, CommonModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  readonly dialog = inject(MatDialog);
  categoryData: any[] = [];
  filteredCategories: any[] = [];
  paginatedCategories: any[] = [];

  // Search & Filter
  searchTerm = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  Math = Math;

  constructor(private catgoryService: CategoryService) { }

  ngOnInit(): void {
    this.catgoryService.categories$.subscribe((res) => {
      this.categoryData = res;
      this.filterCategories();
    });
  }

  filterCategories() {
    let filtered = [...this.categoryData];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cat =>
        cat.category?.toLowerCase().includes(search)
      );
    }

    this.filteredCategories = filtered;
    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCategories = this.filteredCategories.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddCatgoryComponent, {
      panelClass: 'custom-dialog',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '150ms',
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      // Refresh categories after dialog closes
    });
  }

  deleteProduct(id: any) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.catgoryService.deleteCategoryById(id).subscribe({
        next: (response) => {
          // Category deleted successfully
        },
        error: (err) => {
          console.error('Error deleting category:', err);
        },
      });
    }
  }
}
