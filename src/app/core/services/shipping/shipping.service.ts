import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface ShippingInfo {
    province: string;
    shippingCharge: number;
    originalCharge: number;
    isFreeShipping: boolean;
    freeShippingThreshold: number;
    amountForFreeShipping: number;
    estimatedDays: {
        min: number;
        max: number;
    };
    codAvailable: boolean;
}

export interface ShippingConfig {
    _id?: string;
    province: string;
    shippingCharge: number;
    freeShippingThreshold?: number;
    estimatedDays: {
        min: number;
        max: number;
    };
    isDeliveryAvailable: boolean;
    codAvailable: boolean;
    majorCities?: {
        name: string;
        shippingCharge: number;
        estimatedDays: { min: number; max: number };
    }[];
}

export interface DeliveryAvailability {
    available: boolean;
    codAvailable?: boolean;
    estimatedDays?: { min: number; max: number };
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ShippingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/shipping`;

    private shippingInfoSubject = new BehaviorSubject<ShippingInfo | null>(null);
    shippingInfo$ = this.shippingInfoSubject.asObservable();

    // Nepal Provinces
    readonly provinces = [
        'Koshi Province',
        'Madhesh Province',
        'Bagmati Province',
        'Gandaki Province',
        'Lumbini Province',
        'Karnali Province',
        'Sudurpashchim Province'
    ];

    getShippingCharge(province: string, orderAmount: number, city?: string): Observable<ShippingInfo> {
        let url = `${this.apiUrl}/charge?province=${encodeURIComponent(province)}&orderAmount=${orderAmount}`;
        if (city) {
            url += `&city=${encodeURIComponent(city)}`;
        }
        return this.http.get<ShippingInfo>(url).pipe(
            tap(info => this.shippingInfoSubject.next(info))
        );
    }

    checkDeliveryAvailability(province: string): Observable<DeliveryAvailability> {
        return this.http.get<DeliveryAvailability>(
            `${this.apiUrl}/availability?province=${encodeURIComponent(province)}`
        );
    }

    getAllShippingConfig(): Observable<ShippingConfig[]> {
        return this.http.get<ShippingConfig[]>(this.apiUrl);
    }

    // Admin methods
    initializeShippingConfig(): Observable<any> {
        return this.http.post(`${this.apiUrl}/initialize`, {});
    }

    updateShippingConfig(province: string, config: Partial<ShippingConfig>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${encodeURIComponent(province)}`, config);
    }

    getCurrentShippingInfo(): ShippingInfo | null {
        return this.shippingInfoSubject.getValue();
    }

    clearShippingInfo(): void {
        this.shippingInfoSubject.next(null);
    }
}
