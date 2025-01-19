import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SiteHeaderComponent } from '../../../shared/component/site-header/site-header.component';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { IWishlistList } from '../../../core/services/wishlist/wishlist.interface';
import { JsonPipe } from '@angular/common';
import { FooterComponent } from '../../../shared/component/footer/footer.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [SiteHeaderComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WishlistComponent {
  wishlist: IWishlistList[] = [];
  private subscription!: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.wishlistService.wishlist$.subscribe((items) => {
      this.wishlist = items;
    });
    this.cdr.detectChanges(); // Manually trigger UI update
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
