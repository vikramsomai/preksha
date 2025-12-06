import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ContactMessage {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    subject: 'general' | 'order' | 'product' | 'return' | 'payment' | 'other';
    orderId?: string;
    message: string;
    status?: 'new' | 'in-progress' | 'resolved' | 'closed';
    createdAt?: Date;
}

export interface NewsletterSubscription {
    email: string;
    name?: string;
    source?: 'website' | 'checkout' | 'popup' | 'footer';
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/contact`;

    // Newsletter
    subscribeNewsletter(data: NewsletterSubscription): Observable<any> {
        return this.http.post(`${this.apiUrl}/newsletter/subscribe`, data);
    }

    unsubscribeNewsletter(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/newsletter/unsubscribe`, { email });
    }

    // Contact Form
    submitContactForm(message: Partial<ContactMessage>): Observable<any> {
        return this.http.post(`${this.apiUrl}/contact`, message);
    }

    // Admin methods
    getAllSubscribers(active?: boolean): Observable<any> {
        const url = active !== undefined
            ? `${this.apiUrl}/newsletter/subscribers?active=${active}`
            : `${this.apiUrl}/newsletter/subscribers`;
        return this.http.get(url);
    }

    getAllContactMessages(status?: string, subject?: string): Observable<ContactMessage[]> {
        let url = `${this.apiUrl}/messages`;
        const params: string[] = [];
        if (status) params.push(`status=${status}`);
        if (subject) params.push(`subject=${subject}`);
        if (params.length) url += `?${params.join('&')}`;
        return this.http.get<ContactMessage[]>(url);
    }

    updateMessageStatus(messageId: string, status: string, adminNotes?: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/messages/${messageId}`, { status, adminNotes });
    }

    getMessageStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/messages/stats`);
    }
}
