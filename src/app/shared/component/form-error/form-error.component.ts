import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  template: `
    @if(control?.errors && (control?.touched || control?.dirty)){
    <div></div>
    }
  `,
  styles: [
    `
      .text-red-500 {
        color: red;
        font-size: 12px;
      }
    `,
  ],
})
export class FormErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() errorMessages: { [key: string]: string } = {};
}
