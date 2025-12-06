import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Review {
    _id?: string;
    productId: string;
    userId: string;
    userName: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
    isVerifiedPurchase?: boolean;
    helpfulCount?: number;
    createdAt?: Date;
}

export interface ReviewResponse {
    reviews: Review[];
    totalReviews: number;
    currentPage: number;
    totalPages: number;
    ratingStats: {
        averageRating: number;
        totalReviews: number;
        rating5: number;
        rating4: number;
        rating3: number;
        rating2: number;
        rating1: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/reviews`;

    getProductReviews(productId: string, page = 1, limit = 10, sort = 'newest'): Observable<ReviewResponse> {
        return this.http.get<ReviewResponse>(
            `${this.apiUrl}/product/${productId}?page=${page}&limit=${limit}&sort=${sort}`
        );
    }

    addReview(review: Partial<Review>): Observable<any> {
        return this.http.post(this.apiUrl, review);
    }

    updateReview(reviewId: string, review: Partial<Review>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${reviewId}`, review);
    }

    deleteReview(reviewId: string, userId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${reviewId}`, { body: { userId } });
    }

    markHelpful(reviewId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${reviewId}/helpful`, {});
    }

    getUserReviews(userId: string): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
    }
}
