import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { HomeComponent } from '../home/home.component';
import { FooterComponent } from '../../shared/component/footer/footer.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [SiteHeaderComponent, HomeComponent, FooterComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent {}
