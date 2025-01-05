import { Component } from '@angular/core';
import { LoginComponent } from "../../auth/login/login.component";
import { CardComponent } from "../../product/card/card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
