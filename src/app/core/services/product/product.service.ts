import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../features/admin/component/add-item/product.model';
import { environment } from '../../../../environments/environment.development';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private orderKey = 'orderData'; // Key for localStorage
  private secretKey = 'your-secret-key'; // Use a strong secret key
  private apiUrl = 'your-api-endpoint';
  // private baseUrl = 'http://localhost:5000/api';
  baseUrl=environment.apiUrl
  constructor(private http: HttpClient) {}

    // Encrypt data
    private encryptData(data: any): string {
      return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.secretKey
      ).toString();
    }
  
    // Decrypt data
    private decryptData(encryptedData: string): any {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.baseUrl}/api`, product);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
  saveOrderData(order:any){
    let encyptedData=this.encryptData(order)
    localStorage.setItem(this.orderKey,encyptedData)
  }
   getCartFromLocalStorage(): any[] {
    const encryptedCart = localStorage.getItem(this.orderKey);
    return encryptedCart ? this.decryptData(encryptedCart) : [];
  }
}
