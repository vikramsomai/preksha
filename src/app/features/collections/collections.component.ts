import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadService } from '../admin/component/add-item/upload.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [FooterComponent, SiteHeaderComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
})
export class CollectionsComponent {
  imagePath = environment.apiImage;
  currentIndex = 0;
  selectedProduct: any;
  productData: any;
  productId = '';
  constructor(
    private route: ActivatedRoute,
    private productService: UploadService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.route.params.subscribe((res: any) => {
      this.productId = res.id;
    });
    this.productService.getProductById(this.productId).subscribe((res) => {
      this.productData = res;
      this.selectedProduct = res;
      console.log(this.productData);
    });
  }

  nextImage() {}
  prevImage() {}
  onSizeChange(size: string) {}
  decreaseQunatity() {}
  addToCart(product: any) {}
  addQunatity() {}
}
