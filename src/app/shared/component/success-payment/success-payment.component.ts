import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterLink,
} from '@angular/router';

@Component({
  selector: 'app-success-payment',
  standalone: true,
  imports: [RouterLink, RouterModule, HttpClientModule],
  templateUrl: './success-payment.component.html',
  styleUrls: ['./success-payment.component.scss'],
})
export class SuccessPaymentComponent implements OnInit {
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
    console.log('token', token);
    if (token) {
      this.decodedToken = this.base64Decode(token);
      console.log('decode', this.decodedToken);
      this.verifyPaymentAndUpdateStatus();
    }
  }

  // Decode base64 JWT
  // base64Decode(token: string): any {
  //   try {
  //     const base64Payload = token.split('.')[1];
  //     const payload = atob(base64Payload);
  //     return JSON.parse(payload);
  //   } catch (error) {
  //     console.error('Error decoding token:', error);
  //     return null;
  //   }
  // }
  // Decode base64 JWT
  base64Decode(token: string): any {
    try {
      // Replace URL-safe characters
      const base64 = token.replace(/-/g, '+').replace(/_/g, '/');

      // Add padding if necessary
      const paddedBase64 = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '='
      );

      // Decode and parse the token
      const payload = atob(paddedBase64);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Verify payment and update status
  verifyPaymentAndUpdateStatus(): void {
    this.http
      .post<any>('http://localhost:5000/payment-status', {
        product_id: this.decodedToken.transaction_uuid,
      })
      .subscribe(
        (response) => {
          if (response.status === 'success') {
            // Update based on your API's response structure
            this.isSuccess = true;
          } else {
            this.isSuccess = false;
          }
          this.isLoading = false;
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
