import { Component } from '@angular/core';
import { SiteHeaderComponent } from "../../shared/component/site-header/site-header.component";
import { FooterComponent } from "../../shared/component/footer/footer.component";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [SiteHeaderComponent, FooterComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {

}
