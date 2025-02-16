import { ChangeDetectorRef, Component } from '@angular/core';
import { IWishlistList } from '../../../core/services/wishlist/wishlist.interface';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { Route, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { LoginComponent } from '../../../features/auth/login/login.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UploadService } from '../../../features/admin/component/add-item/upload.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterModule, LoginComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  wishlist: IWishlistList[] = [];
  cartlist: any[] = [];
  newCartList: any[] = [];
  isLoggedIn = false;
  productList: any[] = [];
  selectedProduct: any;
  mainImage: string = '';
  constructor(
    public authService: AuthService,
    private wishlistService: WishlistService,
    private route: Router,
    private uploadService: UploadService,
    public cartService: CartService,
    public cdr: ChangeDetectorRef
  ) {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlist = items; // Update the local wishlist when data changes
    });
    this.cartService.cart$.subscribe((items) => {
      this.cartlist = items;
      // this.fetchProducts();
      console.log('carts f data', this.cartlist);
      this.updateNewCartList();
    });
    console.log('user id', authService.getUserId());
  }
  ngOnInit(): void {
    this.fetchProducts();
    this.mainImage = this.selectedProduct?.imageUrls[0];
    this.newCartList = this.productList.map((product) => {
      console.log('product data', product);
    });
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
    this.cdr.detectChanges(); // Trigger change detection
  }

  fetchProducts(): void {
    this.uploadService.getProducts().subscribe(
      (data) => {
        this.productList = data;

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
  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.route.navigateByUrl('/login');
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
  removeCartItem(item: any) {
    const product = item.product;
    console.log(product);
    this.cartService.removeFromCart(product.productId, product.selectedSize);
  }
}
