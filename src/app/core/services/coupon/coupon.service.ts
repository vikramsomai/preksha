import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface CouponValidation {
    valid: boolean;
    code?: string;
    couponCode?: string;
    description?: string;
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue?: number;
    discount?: number;
    finalAmount?: number;
    message?: string;
}

export interface Coupon {
    _id?: string;
    code: string;
    description: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    validFrom: Date;
    validUntil: Date;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
    applicableCategories?: string[];
    applicableProvinces?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class CouponService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/coupons`;

    private appliedCouponSubject = new BehaviorSubject<CouponValidation | null>(null);
    appliedCoupon$ = this.appliedCouponSubject.asObservable();

    validateCoupon(code: string, orderAmount: number, province: string): Observable<CouponValidation> {
        return this.http.post<CouponValidation>(`${this.apiUrl}/validate`, {
            code,
            orderAmount,
            province
        }).pipe(
            tap(result => {
                if (result.valid) {
                    this.appliedCouponSubject.next(result);
                }
            })
        );
    }

    applyCoupon(code: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/apply`, { code });
    }

    removeCoupon(): void {
        this.appliedCouponSubject.next(null);
    }

    getAppliedCoupon(): CouponValidation | null {
        return this.appliedCouponSubject.getValue();
    }

    // Admin methods
    getAllCoupons(): Observable<Coupon[]> {
        return this.http.get<Coupon[]>(this.apiUrl);
    }

    createCoupon(coupon: Partial<Coupon>): Observable<any> {
        return this.http.post(this.apiUrl, coupon);
    }

    updateCoupon(couponId: string, coupon: Partial<Coupon>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${couponId}`, coupon);
    }

    deleteCoupon(couponId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${couponId}`);
    }

    toggleCouponStatus(couponId: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${couponId}/toggle`, {});
    }
}
