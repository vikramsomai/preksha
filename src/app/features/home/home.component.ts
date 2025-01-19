import { Component } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoginComponent,
    ReactiveFormsModule,
    FormsModule,
    LowerCasePipe,
    JsonPipe,
  ],
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
})
export class HomeComponent {
  quantity: number = 1;
  // productList = [
  //   {
  //     id: 1,
  //     name: 'Ribbed Tank Top',
  //     price: 'NPR. 4000',
  //     colors: ['Orange', 'Black', 'White'],
  //     sizes: ['S', 'M', 'L', 'XL'],
  //     image: 'assets/images/products/orange-1.jpg',
  //   },
  //   {
  //     id: 2,
  //     name: 'Cotton Shirt',
  //     price: 'NPR. 5000',
  //     colors: ['Blue', 'Green', 'Yellow'],
  //     sizes: ['M', 'L', 'XL', 'XXL'],
  //     image: 'assets/images/products/shirt-1.jpg',
  //   },
  //   // Add more products
  // ];
  productList = [
    {
      name: 'Ribbed modal T-shirt',
      price: 'NPR. 4000',
      sizes: ['M', 'L', 'XL'],
      description: 'Selling fast! 48 people have this in their carts.',
      colors: [
        {
          name: 'orange',
          image: 'assets/images/products/brown.jpg',
          hoverImage: 'assets/images/products/purple.jpg',
        },
        {
          name: 'light-green',
          image: 'assets/images/products/purple.jpg',
          hoverImage: 'assets/images/products/brown.jpg',
        },
        {
          name: 'light-purple',
          image: 'assets/images/products/green.jpg',
          hoverImage: 'assets/images/products/purple.jpg',
        },
      ],
      id: 0,
      selectedColor: 'Orange', // Default selected color
      selectedSize: 'S', // Default selected size
    },
    {
      name: 'Regular Fit Oxford Shirt',
      price: 'NPR. 5000',
      sizes: ['S', 'M', 'L'],
      colors: [
        {
          name: 'Black',
          image: 'assets/images/products/black-4.jpg',
          hoverImage: 'assets/images/products/black-5.jpg',
        },
        {
          name: 'Dark Blue',
          image: 'assets/images/products/dark-blue-2.jpg',
          hoverImage: 'assets/images/products/dark-blue-2.jpg',
        },
        {
          name: 'Beige',
          image: 'assets/images/products/beige.jpg',
          hoverImage: 'assets/images/products/beige.jpg',
        },
        {
          name: 'Light Blue',
          image: 'assets/images/products/light-blue.jpg',
          hoverImage: 'assets/images/products/light-blue.jpg',
        },
        {
          name: 'White',
          image: 'assets/images/products/white-7.jpg',
          hoverImage: 'assets/images/products/white-7.jpg',
        },
      ],
      selectedColor: 'Orange', // Default selected color
      selectedSize: 'S', // Default selected size
      id: 1,
    },
    {
      name: 'Loose Fit Hoodie',
      price: 'NPR. 10000',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        {
          name: 'White',
          image: 'assets/images/products/white-8.jpg',
          hoverImage: 'assets/images/products/black-6.jpg',
        },
        {
          name: 'Black',
          image: 'assets/images/products/black-7.jpg',
          hoverImage: 'assets/images/products/black-7.jpg',
        },
        {
          name: 'Blue',
          image: 'assets/images/products/blue-2.jpg',
          hoverImage: 'assets/images/products/blue-2.jpg',
        },
      ],
      id: 2,
    },
    {
      name: 'Patterned Scarf',
      price: 'NPR. 4000',
      sizes: ['M', 'L', 'XL'],
      colors: [
        {
          name: 'Brown',
          image: 'assets/images/products/brown-4.jpg',
          hoverImage: 'assets/images/products/black-8.jpg',
        },
        {
          name: 'Black',
          image: 'assets/images/products/black-8.jpg',
          hoverImage: 'assets/images/products/black-8.jpg',
        },
      ],
      id: 3,
    },
    {
      name: 'Slim Fit Fine-knit Turtleneck Sweater',
      price: 'NPR. 2400',
      sizes: ['S', 'M', 'L'],
      colors: [
        {
          name: 'Black',
          image: 'assets/images/products/black-9.jpg',
          hoverImage: 'assets/images/products/black-10.jpg',
        },
        {
          name: 'White',
          image: 'assets/images/products/white-9.jpg',
          hoverImage: 'assets/images/products/white-9.jpg',
        },
      ],
      id: 4,
    },
  ];

  selectedProduct: any;
  cartForm: FormGroup;
  wishlist: IWishlistList[] = [];
  cartlist: any[] = [];
  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private wishlistService: WishlistService
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
    });
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

  onSubmit() {
    console.log(this.cartForm.value);
    if (this.cartForm.valid) {
      const formData = this.cartForm.value;
      console.log('Added to Cart:', { ...this.selectedProduct, ...formData });
    }
  }
  addToCart(item: any) {
    this.cartService.addToCart(
      item,
      this.quantity,
      item.selectedColor,
      item.selectedSize
    ); // Add 2 units of the product
    console.log('qunatity', this.quantity);
  }
  addItem(item: any): void {
    this.wishlistService.addToWishlist(item);
  }
  removeItem(item: any): void {
    this.wishlistService.removeFromWishlist(item.id);
  }

  clearAll(): void {
    this.wishlistService.clearWishlist();
  }
  isInWishlist(product: any): boolean {
    return this.wishlistService.isInWishlist(product.id);
  }
  setSelectedProduct(product: any) {
    this.selectedProduct = product;
    console.log('Selected Product:', this.selectedProduct);
  }
  onQuantityChange() {}
  addQunatity(id: number) {
    this.quantity = this.quantity + id;
  }
  decreaseQunatity(id: number) {
    this.quantity -= id;
  }
  // Method to update selected color
  onColorChange(color: string): void {
    console.log(color);
    this.selectedProduct.selectedColor = color;
  }

  // Method to update selected size
  onSizeChange(size: string): void {
    this.selectedProduct.selectedSize = size;
  }
  updateQunatity(action: string, product: any, qty: number) {
    if (action === 'add') {
      qty = qty + 1;
      this.cartService.updateCartItemQuantity(
        product.product.id,
        product.product.selectedColor,
        product.product.selectedSize,
        qty
      );
    } else if (action === 'delete' && qty > 1) {
      qty = qty - 1;
      this.cartService.updateCartItemQuantity(
        product.product.id,
        product.product.selectedColor,
        product.product.selectedSize,
        qty
      );
    }
  }
  removeCartItem(item: any) {
    const product = item.product;
    this.cartService.removeFromCart(
      product.id,
      product.selectedColor,
      product.selectedSize
    );
  }
}
