import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { ContactService } from '../../core/services/contact/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SiteHeaderComponent, FooterComponent],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    private fb = inject(FormBuilder);
    private contactService = inject(ContactService);
    private snackBar = inject(MatSnackBar);

    contactForm: FormGroup;
    isSubmitting = false;
    submitted = false;

    subjects = [
        { value: 'general', label: 'General Inquiry' },
        { value: 'order', label: 'Order Related' },
        { value: 'product', label: 'Product Question' },
        { value: 'return', label: 'Return/Exchange' },
        { value: 'payment', label: 'Payment Issue' },
        { value: 'other', label: 'Other' }
    ];

    constructor() {
        this.contactForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.pattern(/^[9][6-8]\d{8}$/)]],
            subject: ['general', Validators.required],
            orderId: [''],
            message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]]
        });
    }

    onSubmit(): void {
        if (this.contactForm.invalid) {
            this.contactForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        this.contactService.submitContactForm(this.contactForm.value).subscribe({
            next: (res) => {
                this.submitted = true;
                this.isSubmitting = false;
                this.snackBar.open('Message sent successfully! We\'ll get back to you soon.', 'Close', {
                    duration: 5000,
                    panelClass: ['success-snackbar']
                });
                this.contactForm.reset({ subject: 'general' });
            },
            error: (err) => {
                this.isSubmitting = false;
                this.snackBar.open('Failed to send message. Please try again.', 'Close', {
                    duration: 4000,
                    panelClass: ['error-snackbar']
                });
            }
        });
    }
}
