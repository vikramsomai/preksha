import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoginComponent } from './../auth/login/login.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { IWishlistList } from '../../core/services/wishlist/wishlist.interface';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { JsonPipe, LowerCasePipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { UploadService } from '../admin/component/add-item/upload.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { SliderComponent } from '../../shared/component/slider/slider.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, FooterComponent],
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
})
export class HomeComponent implements OnInit {
  quantity: number = 1; // Default quantity
  // productList = [
  //   {
  //     name: 'Ribbed modal T-shirt',
  //     price: 4000,
  //     sizes: ['M', 'L', 'XL'],
  //     description: 'Selling fast! 48 people have this in their carts.',
  //     image: 'assets/images/products/white-8.jpg',
  //     hoverImage: 'assets/images/products/white-8.jpg',
  //     colors: [
  //       {
  //         name: 'orange',
  //         image: 'assets/images/products/brown.jpg',
  //         hoverImage: 'assets/images/products/purple.jpg',
  //       },
  //       {
  //         name: 'light-green',
  //         image: 'assets/images/products/purple.jpg',
  //         hoverImage: 'assets/images/products/brown.jpg',
  //       },
  //       {
  //         name: 'light-purple',
  //         image: 'assets/images/products/green.jpg',
  //         hoverImage: 'assets/images/products/purple.jpg',
  //       },
  //     ],
  //     id: 0,
  //     selectedColor: 'Orange', // Default selected color
  //     selectedSize: 'S', // Default selected size
  //   },
  //   {
  //     name: 'Regular Fit Oxford Shirt',
  //     price: 5000,
  //     sizes: ['S', 'M', 'L'],
  //     image: 'assets/images/products/white-8.jpg',
  //     hoverImage: 'assets/images/products/white-8.jpg',
  //     colors: [
  //       {
  //         name: 'Black',
  //         image: 'assets/images/products/black-4.jpg',
  //         hoverImage: 'assets/images/products/black-5.jpg',
  //       },
  //       {
  //         name: 'Dark Blue',
  //         image: 'assets/images/products/dark-blue-2.jpg',
  //         hoverImage: 'assets/images/products/dark-blue-2.jpg',
  //       },
  //     ],
  //     selectedColor: 'Orange', // Default selected color
  //     selectedSize: 'S', // Default selected size
  //     id: 1,
  //   },
  // ];
  productList: any[] = [];
  selectedProduct: any;
  cartForm: FormGroup;
  mainImage: string = '';
  currentIndex: number = 0; // To track the current image index
  wishlist: IWishlistList[] = [];
  cartlist: any[] = [];
  newCartList: any[] = [];
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public cartService: CartService,
    private uploadService: UploadService,
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef
  ) {
    this.cartForm = this.fb.group({
      color: new FormControl('', Validators.required),
      size: new FormControl('', Validators.required),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
    this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlist = items; // Update the local wishlist when data changes
    });
    this.cartService.cart$.subscribe((items) => {
      this.cartlist = items;
      // this.fetchProducts();
      console.log('carts f data', this.cartlist);
      this.updateNewCartList();
    });
  }
  ngOnInit(): void {
    this.fetchProducts();
    this.mainImage = this.selectedProduct?.imageUrls[0];
    this.newCartList = this.productList.map((product) => {
      console.log('product data', product);
    });
    // this.selectedProduct.selectedSize = 'S';
  }
  updateNewCartList(): void {
    this.newCartList = this.cartlist.map((cartItem) => {
      const matchedProduct = this.productList.find(
        (product) => product.productId === cartItem.product.productId
      );

      if (matchedProduct) {
        cartItem.product.price = matchedProduct.price;
      }

      return cartItem; // Return the updated cartItem
    });
  }

  fetchProducts(): void {
    this.uploadService.getProducts().subscribe(
      (data) => {
        this.productList = data;
        console.log('product dadadadaa', data);
        this.newCartList = this.cartlist.map((cartItem) => {
          const matchedProduct = this.productList.find(
            (product) => product.productId === cartItem.product.productId
          );

          if (matchedProduct) {
            cartItem.product.price = matchedProduct.price;
            return {
              ...cartItem,
            };
          }
          return cartItem; // Keep the original cartItem if no match is found
        });

        console.log('cart data', this.newCartList);
        console.log(this.productList);
        this.cdr.detectChanges();
      },
      (err) => {
        console.error('Error fetching products:', err);
      }
    );
  }
  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.selectedProduct.imageUrls.length - 1; // Loop to the last image
    }
    this.mainImage = this.selectedProduct.imageUrls[this.currentIndex];
  }

  // Function to go to the next image
  nextImage(): void {
    if (this.currentIndex < this.selectedProduct.imageUrls.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to the first image
    }
    this.mainImage = this.selectedProduct.imageUrls[this.currentIndex];
  }

  openQuickAddModal(product: any) {
    this.selectedProduct = product;

    // Pre-fill the form with the default values of the selected product
    this.cartForm.patchValue({
      color: product.colors[0],
      size: product.sizes[0],
      quantity: 1,
    });
    console.log(this.cartForm.value);
  }
  updateQunatity(action: string, item: any): void {
    const currentQuantity = item.quantity;
    let updatedQuantity = currentQuantity;

    if (action === 'add') {
      updatedQuantity++;
    } else if (action === 'delete' && currentQuantity > 1) {
      updatedQuantity--;
    }

    this.cartService.updateCartItemQuantity(
      item.product.productId,
      item.selectedSize,
      updatedQuantity
    );
  }

  onSubmit() {
    console.log(this.cartForm.value);
    if (this.cartForm.valid) {
      const formData = this.cartForm.value;
      console.log('Added to Cart:', { ...this.selectedProduct, ...formData });
    }
  }
  // addToCart(item: any) {
  //   const newItem = {
  //     productId: item.productId,
  //     productName: item.productName,
  //     imageUrls: item.imageUrls,
  //     qty: item.qty,
  //   };

  //   this.cartService.addToCart(newItem, this.quantity, item.selectedSize); // Add 2 units of the product
  //   console.log('qunatity', item);
  // }
  addToCart(item: any): void {
    if (item.selectedSize == undefined) {
      item.selectedSize = 'S';
    }
    console.log('selected size', item.selectedSize);
    this.cartService.addToCart(item, this.quantity, item.selectedSize);
  }

  addItem(item: any): void {
    this.wishlistService.addToWishlist(item);
  }
  removeItem(item: any): void {
    this.wishlistService.removeFromWishlist(item.productId);
  }

  clearAll(): void {
    this.wishlistService.clearWishlist();
  }
  isInWishlist(product: any): boolean {
    return this.wishlistService.isInWishlist(product.productId);
  }
  setSelectedProduct(product: any) {
    this.selectedProduct = product;
    console.log('Selected Product:', this.selectedProduct);
  }

  addQunatity(): void {
    this.quantity += 1;
  }

  decreaseQunatity(): void {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  // Method to update selected color
  onColorChange(color: string): void {
    this.selectedProduct.selectedColor = color;
  }

  // Method to update selected size
  onSizeChange(size: string): void {
    this.selectedProduct.selectedSize = size;
  }
  // updateQunatity(action: string, item: any): void {
  //   console.log('item add', item);
  //   const currentQuantity = item.quantity; // Get the current quantity directly
  //   let updatedQuantity = currentQuantity;

  //   if (action === 'add') {
  //     updatedQuantity = currentQuantity + 1;
  //     console.log('update qty', updatedQuantity);
  //   } else if (action === 'delete' && currentQuantity > 1) {
  //     updatedQuantity = currentQuantity - 1;
  //     console.log('update qty', updatedQuantity);
  //   }

  //   // Update the cart with the new quantity
  //   this.cartService.updateCartItemQuantity(
  //     item.product.id,
  //     item.selectedColor,
  //     item.selectedSize,
  //     updatedQuantity
  //   );
  // }

  removeCartItem(item: any) {
    const product = item.product;
    console.log(product);
    this.cartService.removeFromCart(product.productId, product.selectedSize);
  }
}
