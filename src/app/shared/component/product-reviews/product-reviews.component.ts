import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService, Review, ReviewResponse } from '../../../core/services/review/review.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-product-reviews',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './product-reviews.component.html',
    styleUrl: './product-reviews.component.scss'
})
export class ProductReviewsComponent implements OnInit {
    @Input() productId!: string;

    private reviewService = inject(ReviewService);
    private authService = inject(AuthService);
    private snackBar = inject(MatSnackBar);

    reviews: Review[] = [];
    ratingStats: any = null;
    isLoading = true;
    currentPage = 1;
    totalPages = 1;
    sortBy = 'newest';

    // Review form
    showReviewForm = false;
    isSubmitting = false;
    newReview = {
        rating: 5,
        title: '',
        comment: ''
    };
    hoverRating = 0;

    get isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    get currentUser(): any {
        return this.authService.getUserData();
    } ngOnInit(): void {
        this.loadReviews();
    }

    loadReviews(): void {
        this.isLoading = true;
        this.reviewService.getProductReviews(this.productId, this.currentPage, 10, this.sortBy)
            .subscribe({
                next: (res: ReviewResponse) => {
                    this.reviews = res.reviews;
                    this.ratingStats = res.ratingStats;
                    this.totalPages = res.totalPages;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Failed to load reviews', err);
                    this.isLoading = false;
                }
            });
    }

    onSortChange(sort: string): void {
        this.sortBy = sort;
        this.currentPage = 1;
        this.loadReviews();
    }

    loadMore(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.reviewService.getProductReviews(this.productId, this.currentPage, 10, this.sortBy)
                .subscribe({
                    next: (res: ReviewResponse) => {
                        this.reviews = [...this.reviews, ...res.reviews];
                    }
                });
        }
    }

    setRating(rating: number): void {
        this.newReview.rating = rating;
    }

    submitReview(): void {
        if (!this.isLoggedIn) {
            this.snackBar.open('Please login to write a review', 'Close', { duration: 3000 });
            return;
        }

        if (!this.newReview.comment.trim()) {
            this.snackBar.open('Please write a comment', 'Close', { duration: 3000 });
            return;
        }

        this.isSubmitting = true;
        const user = this.currentUser;

        this.reviewService.addReview({
            productId: this.productId,
            userId: user.userId || user.id,
            userName: user.firstName || user.firstname || 'Customer',
            rating: this.newReview.rating,
            title: this.newReview.title,
            comment: this.newReview.comment
        }).subscribe({
            next: (res) => {
                this.snackBar.open('Review submitted successfully!', 'Close', { duration: 3000 });
                this.showReviewForm = false;
                this.newReview = { rating: 5, title: '', comment: '' };
                this.isSubmitting = false;
                this.loadReviews();
            },
            error: (err) => {
                this.isSubmitting = false;
                const message = err.error?.message || 'Failed to submit review';
                this.snackBar.open(message, 'Close', { duration: 4000 });
            }
        });
    }

    markHelpful(reviewId: string): void {
        this.reviewService.markHelpful(reviewId).subscribe({
            next: (res) => {
                const review = this.reviews.find(r => r._id === reviewId);
                if (review) {
                    review.helpfulCount = res.helpfulCount;
                }
            }
        });
    }

    getStarArray(rating: number): boolean[] {
        return Array(5).fill(false).map((_, i) => i < Math.round(rating));
    }

    getRatingPercentage(count: number): number {
        if (!this.ratingStats?.totalReviews) return 0;
        return (count / this.ratingStats.totalReviews) * 100;
    }

    formatDate(date: Date | string | undefined): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
