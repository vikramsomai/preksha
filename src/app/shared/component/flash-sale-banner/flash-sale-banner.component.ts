import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlashSaleService, FlashSale } from '../../../core/services/flash-sale/flash-sale.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Subscription, interval } from 'rxjs';

@Component({
    selector: 'app-flash-sale-banner',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './flash-sale-banner.component.html',
    styleUrl: './flash-sale-banner.component.scss'
})
export class FlashSaleBannerComponent implements OnInit, OnDestroy {
    private flashSaleService = inject(FlashSaleService);
    private cartService = inject(CartService);

    flashSales: FlashSale[] = [];
    currentSaleIndex = 0;
    countdowns: { [key: string]: string } = {};
    isLoading = true;

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.loadFlashSales();

        // Update countdown every second
        const countdownSub = interval(1000).subscribe(() => {
            this.updateCountdowns();
        });
        this.subscriptions.push(countdownSub);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    loadFlashSales(): void {
        this.flashSaleService.getActiveFlashSales().subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.success) {
                    this.flashSales = response.flashSales;
                    this.updateCountdowns();
                }
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    updateCountdowns(): void {
        this.flashSales.forEach(sale => {
            this.countdowns[sale._id] = this.flashSaleService.formatCountdown(sale.endDate);
        });
    }

    get currentSale(): FlashSale | null {
        return this.flashSales[this.currentSaleIndex] || null;
    }

    nextSale(): void {
        if (this.flashSales.length > 1) {
            this.currentSaleIndex = (this.currentSaleIndex + 1) % this.flashSales.length;
        }
    }

    prevSale(): void {
        if (this.flashSales.length > 1) {
            this.currentSaleIndex = this.currentSaleIndex === 0
                ? this.flashSales.length - 1
                : this.currentSaleIndex - 1;
        }
    }

    addToCart(product: any, salePrice: number): void {
        const cartProduct = {
            productId: product.productId._id,
            productName: product.productId.productName,
            price: salePrice,
            imageUrls: product.productId.imageUrls,
            originalPrice: product.originalPrice
        };
        const quantity = 1;
        const selectedSize = product.productId.sizes?.[0] || 'M';
        this.cartService.addToCart(cartProduct, quantity, selectedSize);
    }

    getStockProgress(product: any): number {
        if (!product.stockLimit) return 0;
        return (product.soldCount / product.stockLimit) * 100;
    }

    getRemainingStock(product: any): number {
        if (!product.stockLimit) return product.productId.stock;
        return product.stockLimit - product.soldCount;
    }
}
