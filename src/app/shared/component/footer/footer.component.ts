import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../core/services/contact/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  email = 'prekshaaclothing@gmail.com';
  newsletterEmail = '';
  isSubscribing = false;
  subscribeSuccess = false;

  private contactService = inject(ContactService);
  private snackBar = inject(MatSnackBar);

  subscribeNewsletter(): void {
    if (!this.newsletterEmail || !this.newsletterEmail.includes('@')) {
      this.snackBar.open('Please enter a valid email address', 'Close', { duration: 3000 });
      return;
    }

    this.isSubscribing = true;
    this.contactService.subscribeNewsletter({
      email: this.newsletterEmail,
      source: 'footer'
    }).subscribe({
      next: (res) => {
        this.subscribeSuccess = true;
        this.isSubscribing = false;
        this.snackBar.open('Thank you for subscribing!', 'Close', { duration: 4000 });
        this.newsletterEmail = '';
        setTimeout(() => this.subscribeSuccess = false, 5000);
      },
      error: (err) => {
        this.isSubscribing = false;
        const message = err.error?.message || 'Failed to subscribe. Please try again.';
        this.snackBar.open(message, 'Close', { duration: 4000 });
      }
    });
  }
}
