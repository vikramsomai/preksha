import { Component } from '@angular/core';
import { SiteHeaderComponent } from "../../../shared/component/site-header/site-header.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SiteHeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

}
