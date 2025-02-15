import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-success-payment',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './success-payment.component.html',
  styleUrl: './success-payment.component.scss',
})
export class SuccessPaymentComponent {
  isLoading: boolean = true;
  isSuccess: boolean = false;
  decodedToken: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get the 'data' query parameter
    const token = this.route.snapshot.queryParamMap.get('data');

    if (token) {
      this.decodedToken = this.base64Decode(token);
      this.verifyPaymentAndUpdateStatus();
    } else {
      this.isLoading = false;
      this.isSuccess = false;
    }
  }

  // Decode base64 JWT
  base64Decode(token: string): any {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  }

  // Verify payment and update status
  verifyPaymentAndUpdateStatus(): void {
    this.http
      .post<any>('http://localhost:3000/payment-status', {
        product_id: this.decodedToken.transaction_uuid,
      })
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.isSuccess = true;
        },
        (error) => {
          this.isLoading = false;
          console.error('Error verifying payment:', error);
        }
      );
  }

  // Navigate to homepage
  goToHomepage(): void {
    this.router.navigate(['/']);
  }
}
