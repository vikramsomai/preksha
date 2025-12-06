import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map, interval, startWith, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface FlashSaleProduct {
    productId: {
        _id: string;
        productName: string;
        imageUrls: string[];
        category: string;
        subcategory: string;
        stock: number;
    };
    salePrice: number;
    originalPrice: number;
    stockLimit: number | null;
    soldCount: number;
}

export interface FlashSale {
    _id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    discountPercentage: number;
    products: FlashSaleProduct[];
    isActive: boolean;
    bannerImage?: string;
    priority: number;
    isLive?: boolean;
    timeRemaining?: number;
}

export interface ProductFlashSaleInfo {
    success: boolean;
    inFlashSale: boolean;
    flashSale?: {
        id: string;
        name: string;
        endDate: Date;
        salePrice: number;
        originalPrice: number;
        discountPercentage: number;
        stockLimit: number | null;
        soldCount: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class FlashSaleService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/flash-sales`;

    private activeFlashSalesSubject = new BehaviorSubject<FlashSale[]>([]);
    activeFlashSales$ = this.activeFlashSalesSubject.asObservable();

    private countdownSubject = new BehaviorSubject<{ [key: string]: string }>({});
    countdown$ = this.countdownSubject.asObservable();

    constructor() {
        // Auto-refresh active flash sales every 5 minutes
        interval(300000).pipe(
            startWith(0),
            switchMap(() => this.getActiveFlashSales())
        ).subscribe();

        // Update countdown every second
        interval(1000).subscribe(() => this.updateCountdowns());
    }

    getActiveFlashSales(): Observable<{ success: boolean; flashSales: FlashSale[] }> {
        return this.http.get<{ success: boolean; flashSales: FlashSale[] }>(`${this.apiUrl}/active`).pipe(
            tap(response => {
                if (response.success) {
                    this.activeFlashSalesSubject.next(response.flashSales);
                }
            })
        );
    }

    getUpcomingFlashSales(): Observable<{ success: boolean; flashSales: FlashSale[] }> {
        return this.http.get<{ success: boolean; flashSales: FlashSale[] }>(`${this.apiUrl}/upcoming`);
    }

    getFlashSaleById(id: string): Observable<{ success: boolean; flashSale: FlashSale }> {
        return this.http.get<{ success: boolean; flashSale: FlashSale }>(`${this.apiUrl}/${id}`);
    }

    getProductFlashSale(productId: string): Observable<ProductFlashSaleInfo> {
        return this.http.get<ProductFlashSaleInfo>(`${this.apiUrl}/product/${productId}`);
    }

    // Check if a product is currently in a flash sale
    isProductInFlashSale(productId: string): Observable<boolean> {
        return this.getProductFlashSale(productId).pipe(
            map(response => response.inFlashSale)
        );
    }

    // Get sale price for a product if it's in a flash sale
    getSalePrice(productId: string): Observable<number | null> {
        return this.getProductFlashSale(productId).pipe(
            map(response => response.inFlashSale && response.flashSale ? response.flashSale.salePrice : null)
        );
    }

    // Get discount percentage for a product in flash sale
    getDiscountPercentage(productId: string): Observable<number> {
        return this.getProductFlashSale(productId).pipe(
            map(response => response.inFlashSale && response.flashSale ? response.flashSale.discountPercentage : 0)
        );
    }

    private updateCountdowns(): void {
        const flashSales = this.activeFlashSalesSubject.value;
        const countdowns: { [key: string]: string } = {};

        flashSales.forEach(sale => {
            const endDate = new Date(sale.endDate);
            const now = new Date();
            const diff = endDate.getTime() - now.getTime();

            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                countdowns[sale._id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                countdowns[sale._id] = 'ENDED';
            }
        });

        this.countdownSubject.next(countdowns);
    }

    // Format countdown for display
    formatCountdown(endDate: Date): string {
        const now = new Date();
        const diff = new Date(endDate).getTime() - now.getTime();

        if (diff <= 0) return 'ENDED';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Calculate savings
    calculateSavings(originalPrice: number, salePrice: number): number {
        return originalPrice - salePrice;
    }

    // Calculate discount percentage
    calculateDiscountPercent(originalPrice: number, salePrice: number): number {
        return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }

    // ADMIN methods
    getAllFlashSales(): Observable<{ success: boolean; flashSales: FlashSale[] }> {
        return this.http.get<{ success: boolean; flashSales: FlashSale[] }>(this.apiUrl);
    }

    createFlashSale(flashSale: Partial<FlashSale>): Observable<{ success: boolean; flashSale: FlashSale; message: string }> {
        return this.http.post<{ success: boolean; flashSale: FlashSale; message: string }>(this.apiUrl, flashSale);
    }

    updateFlashSale(id: string, updates: Partial<FlashSale>): Observable<{ success: boolean; flashSale: FlashSale; message: string }> {
        return this.http.put<{ success: boolean; flashSale: FlashSale; message: string }>(`${this.apiUrl}/${id}`, updates);
    }

    deleteFlashSale(id: string): Observable<{ success: boolean; message: string }> {
        return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
    }
}
