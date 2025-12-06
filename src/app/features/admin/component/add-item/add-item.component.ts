import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Product, ProductSize } from './product.model';
import { UploadService } from './upload.service';
import { __await } from 'tslib';
import { AsyncPipe, JsonPipe, CommonModule, SlicePipe, DecimalPipe } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../../core/services/category/category.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    JsonPipe,
    NgxDropzoneModule,
    AsyncPipe,
    CommonModule,
    SlicePipe,
    DecimalPipe,
  ],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent {
  formMode = 'none';
  productForm: FormGroup;
  productId!: string;
  products$: Observable<any[]> | undefined; // Observable for products
  uploadedImages: string[] = [];
  selectedFiles: File[] = [];
  existingImageUrls: string[] = []; // Stores existing images during edit
  products: any[] = []; // Store fetched products
  selectedSizes: string[] = [];
  category: any[] = [];
  subCategory: any[] = [];
  selectedImages: File[] = [];

  // Search, filter, pagination
  searchTerm = '';
  filterCategory = '';
  currentPage = 1;
  itemsPerPage = 10;

  // Available product sizes
  sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Image upload slots (4 slots)
  imageSlots: number[] = [0, 1, 2, 3];

  // Math for template
  Math = Math;

  // Filtered products based on search and category
  get filteredProducts(): any[] {
    let filtered = this.products;

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.productName?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    if (this.filterCategory) {
      filtered = filtered.filter(p => p.category === this.filterCategory);
    }

    return filtered;
  }

  // Paginated products
  get paginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProducts.slice(start, end);
  }

  // Total pages
  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  // Get page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Go to page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Filter products - reset to first page
  filterProducts(): void {
    this.currentPage = 1;
  }

  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService,
    private catgoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      price: [0, Validators.required],
      discount: [0, Validators.required],
      qty: [1, Validators.required],
      sizes: [[]],
      bestseller: [false],
      imageUrls: [[]],
    });
  }

  ngOnInit(): void {
    this.fetchProducts();
    this.products$ = this.uploadService.products$;

    this.catgoryService.categories$.subscribe((res) => {
      this.category = res;
      console.log('category', this.category);
    });
    this.catgoryService.subCategories$.subscribe((res) => {
      this.subCategory = res;
    });
  }
  files: File[] = [];
  onSelect(event: any) {

    this.selectedFiles.push(...event.addedFiles);
  }
  onRemove(event: any) {
    this.selectedFiles.splice(this.files.indexOf(event), 1);
  }

  // Fetch products from API
  fetchProducts(): void {
    this.uploadService.getProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (err) => {
        console.error('Error fetching products:', err);
      }
    );
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  async uploadImages(): Promise<string[]> {
    if (this.selectedFiles.length) {
      return new Promise((resolve, reject) => {
        this.uploadService.uploadImages(this.selectedFiles).subscribe(
          (res) => {
            this.uploadedImages = res.imagePaths; // Store the image URLs
            resolve(res.imagePaths); // Return the uploaded image URLs
          },
          (err) => {
            console.error('Error uploading images:', err);
            reject(err);
          }
        );
      });
    } else {
      return Promise.resolve([]); // If no files, return an empty array
    }
  }

  onSizeChange(event: any) {
    const size = event.target.value;
    if (event.target.checked) {
      this.selectedSizes.push(size);
    } else {
      this.selectedSizes = this.selectedSizes.filter((s) => s !== size);
    }
  }

  async onSubmit() {
    if (this.productForm.valid) {
      try {
        // Upload images and get the URLs
        const imageUrls = await this.uploadImages();

        // Patch uploaded image URLs and selected sizes to the form
        this.productForm.patchValue({
          imageUrls: imageUrls,
          sizes: this.selectedSizes,
        });

        console.log('Form data to submit:', this.productForm.value);

        // Send the complete form data to the backend
        this.uploadService.addProduct(this.productForm.value).subscribe(
          (res) => {
            this.handleClose();
          },
          (err) => {
            console.error('Error saving product:', err);
          }
        );
      } catch (err) {
        console.error('Error in submission process:', err);
      }
    } else {

    }
  }

  // Handle image upload (simulated with file input dialog)
  onImageUpload(slotIndex: number): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.uploadedImages[slotIndex] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  }
  // Toggle product size selection
  // toggleSize(size: string): void {
  //   const index = this.selectedSizes.indexOf(size);
  //   if (index > -1) {
  //     this.selectedSizes.splice(index, 1); // Remove if already selected
  //   } else {
  //     this.selectedSizes.push(size); // Add if not selected
  //   }
  // }
  toggleSize(size: string): void {
    const index = this.selectedSizes.indexOf(size);
    if (index > -1) {
      this.selectedSizes.splice(index, 1); // Remove size if already selected
    } else {
      this.selectedSizes.push(size); // Add size if not already selected
    }
    this.productForm.patchValue({ sizes: this.selectedSizes }); // Update form
  }
  handleAddProduct() {
    this.productForm.reset();
    this.selectedFiles = [];
    this.existingImageUrls = [];
    this.uploadedImages = [];
    this.selectedSizes = [];
    this.formMode = 'add';
  }
  handleClose() {
    this.productForm.reset();
    this.formMode = 'none';
    this.selectedFiles = [];
    this.existingImageUrls = [];
    this.uploadedImages = [];
    this.selectedSizes = [];
  }
  handleEdit(id: any) {
    this.formMode = 'edit';
    this.selectedFiles = []; // Reset new files
    this.uploadService.getProductById(id).subscribe((res) => {
      this.productForm.patchValue({
        productName: res.productName,
        description: res.description,
        category: res.category,
        subcategory: res.subcategory,
        price: res.price,
        discount: res.discount,
        qty: res.qty,
        sizes: res.size,
        bestseller: res.bestseller,
      });
      this.productId = res.productId;
      this.selectedSizes = res.sizes || [];
      // Store existing image URLs separately (not in selectedFiles)
      this.existingImageUrls = res.imageUrls || [];
    });
  }

  // Remove existing image during edit
  removeExistingImage(index: number) {
    this.existingImageUrls.splice(index, 1);
  }
  async handleUpdate() {
    if (this.productForm.valid) {
      try {
        // Upload new images and get the URLs
        const newImageUrls = await this.uploadImages();

        // Combine existing images with newly uploaded images
        const combinedImageUrls = [...this.existingImageUrls, ...newImageUrls];

        // Patch uploaded image URLs and selected sizes to the form
        this.productForm.patchValue({
          imageUrls: combinedImageUrls,
          sizes: this.selectedSizes,
        });

        console.log('Form data to submit:', this.productForm.value);

        // Send the complete form data to the backend
        this.uploadService
          .updateProduct(
            this.productForm.value.productId,
            this.productForm.value
          )
          .subscribe(
            (res) => {
              console.log('Product saved successfully:', res);
              this.handleClose();
              this.fetchProducts();
            },
            (err) => {
              console.error('Error saving product:', err);
            }
          );
      } catch (err) {
        console.error('Error in submission process:', err);
      }
    } else {
      console.error('Form is invalid!');
    }
  }
  async saveProduct() {
    console.log('get images', this.productForm.get('imageUrls')?.value);
    if (this.productForm.valid) {
      try {
        // Upload new images
        const uploadedImages = await this.uploadImages();
        console.log('Uploaded Image URLs:', uploadedImages);

        // Combine existing and new images (if edit mode)
        if (this.formMode === 'edit') {
          const combinedImages = [...this.existingImageUrls, ...uploadedImages];
          this.productForm.patchValue({ imageUrls: combinedImages });
        } else {
          this.productForm.patchValue({ imageUrls: uploadedImages });
        }

        // Add additional data
        this.productForm.patchValue({
          sizes: this.selectedSizes,
          productId: this.productId,
        });

        // Log the final payload
        const productData = this.productForm.value;
        console.log('Final Payload:', productData);

        // API call
        if (this.formMode === 'add') {
          this.uploadService.addProduct(productData).subscribe(
            (res) => {
              console.log('Product added successfully:', res);
              this.handleClose();
            },
            (err) => console.error('Error adding product:', err)
          );
        } else if (this.formMode === 'edit') {
          this.uploadService
            .updateProduct(this.productId, productData)
            .subscribe(
              (res) => {
                console.log('Product updated successfully:', res);
                this.handleClose();
              },
              (err) => console.error('Error updating product:', err)
            );
        }
      } catch (err) {
        console.error('Error in saving product:', err);
      }
    } else {
      console.error('Form is invalid!');
    }
  }

  // async saveProduct() {
  //   console.log(this.productForm.value);
  //   if (this.productForm.valid) {
  //     try {
  //       const imageUrls = await this.uploadImages();
  //       this.productForm.patchValue({
  //         imageUrls,
  //         sizes: this.selectedSizes,
  //         productId: this.productId,
  //       });

  //       const productData = this.productForm.value;
  //       if (this.formMode === 'add') {
  //         this.uploadService.addProduct(productData).subscribe(
  //           (res) => {
  //             console.log('Product added successfully:', res);
  //             this.handleClose();
  //           },
  //           (err) => console.error('Error adding product:', err)
  //         );
  //       } else if (this.formMode === 'edit') {
  //         console.log('update time', productData, this.productId);
  //         this.uploadService
  //           .updateProduct(this.productId, productData)
  //           .subscribe(
  //             (res) => {
  //               console.log('Product updated successfully:', res);
  //               this.handleClose();
  //             },
  //             (err) => console.error('Error updating product:', err)
  //           );
  //       }
  //     } catch (err) {
  //       console.error('Error in saving product:', err);
  //     }
  //   } else {
  //     console.error('Form is invalid!');
  //   }
  // }
  deleteProduct(id: any) {
    this.uploadService.deleteProductById(id).subscribe((res) => {

    });
  }
}
