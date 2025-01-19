import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './shared/component/site-header/site-header.component';

import { FooterComponent } from './shared/component/footer/footer.component';
import { HomeComponent } from './features/home/home.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'preksha';
}
