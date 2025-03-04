import { ChangeDetectorRef, Component } from '@angular/core';
import { IWishlistList } from '../../../core/services/wishlist/wishlist.interface';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { Route, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UploadService } from '../../../features/admin/component/add-item/upload.service';
import { SearchItemPipe } from '../../pipes/search-item.pipe';
import { FilterPipe } from '../../pipes/filter.pipe';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterModule, SearchItemPipe, FormsModule],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  wishlist: IWishlistList[] = [];
  cartlist: any[] = [];
  newCartList: any[] = [];
  isLoggedIn = false;
  productList: any[] = [];
  searchItem = '';
  productData: any[] = [];
  imagePath = environment.apiImage;
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
      this.updateNewCartList();
    });
  }
  ngOnInit(): void {
    this.fetchProducts();
    this.uploadService.getProducts().subscribe((res) => {
      this.productData = res;
    });
    this.mainImage = this.selectedProduct?.imageUrls[0];
  }
  updateNewCartList(): void {
    this.newCartList = this.cartlist.filter((cartItem) => {
      const matchedProduct = this.productList.find(
        (product) => product.productId === cartItem.product.productId
      );

      if (matchedProduct) {
        // Update the price from the server data
        cartItem.product.price = matchedProduct.price;
        return true; // Keep the item in the new cart list
      }

      // If no matching product is found, the cart item is removed.
      return false;
    });
  }

  fetchProducts(): void {
    this.uploadService.getProducts().subscribe(
      (data) => {
        this.productList = data;

        // Filter and update cart items
        this.newCartList = this.cartlist.filter((cartItem) => {
          const matchedProduct = this.productList.find(
            (product) => product.productId === cartItem.product.productId
          );

          if (matchedProduct) {
            // Update the cart item's price
            cartItem.product.price = matchedProduct.price;
            return true; // Keep this cart item
          }

          // Remove the cart item if no match is found
          return false;
        });
        this.cartService.updateCart(this.newCartList);
        // Log the updated cart list and product list
        console.log('Updated cart data:', this.newCartList);
        console.log('Product list:', this.productList);

        // Trigger change detection to update the UI
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

    if (action === 'add' && currentQuantity < 10) {
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

  removeCartItem(productId: any, selectedSize: any) {
    this.cartService.removeFromCart(productId, selectedSize);
  }
}
