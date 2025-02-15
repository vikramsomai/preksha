import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private secretKey = 'your-secret-key'; // Use a strong secret key

  encrypt(data: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
  }

  decrypt(data: string): any {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}
