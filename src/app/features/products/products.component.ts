import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { NavigationEnd, NavigationStart, Router, RouterLink } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { UploadService } from '../admin/component/add-item/upload.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../core/services/category/category.service';
import { ProductFilterPipe } from '../../shared/pipes/product-filter.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent, ProductFilterPipe,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  productList: any[] = [];
  imagePath = environment.apiImage;
  cartlist: any[] = [];
  mainImage: string = '';
  loading: boolean = true;
  newCartList: any[] = [];
  selectedCategories: any[] = [];
  categoryData: any[] = [];

  selectedProduct: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthService,
    public cartService: CartService,
    private uploadService: UploadService,
    private wishlistService: WishlistService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationStart) {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scrolling
      }
    });
    this.fetchProducts();
    this.mainImage = this.selectedProduct?.imageUrls[0];
    setTimeout(() => {
      this.loading = false;
    }, 500);
    this.categoryService.subCategories$.subscribe((res) => {
      this.categoryData = res;
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
      },
      (err) => {
        console.error('Error fetching products:', err);
      }
    );
  }
  setSelectedProduct(item: any) {}
  isInWishlist(item: any) {
    return 0;
  }
  addItem(item: any) {}
  removeItem(item: any) {}
  showDisocuntPrice(item: any, item1: any) {
    return 0;
  }
  changeCategory(item: any) {
    this.selectedCategories.push(item);
  }
}
