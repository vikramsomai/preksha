import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  template: `
    @if(control?.errors && (control?.touched || control?.dirty)){
    <div class="text-red-500">{{ errorMessages }}</div>
    }
  `,
  imports: [],
  styles: [
    `
      .text-red-500 {
        color: red;
        margin-left: 10px;
        font-size: 12px;
      }
    `,
  ],
})
export class FormErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() errorMessages!: string;
}
