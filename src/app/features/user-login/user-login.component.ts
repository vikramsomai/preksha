import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [FooterComponent, SiteHeaderComponent, ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class UserLoginComponent {
  constructor(private authService: AuthService, private route: Router) {}
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  handleLogin() {
    const payload = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };
    this.authService.login(payload).subscribe({
      next: (Response) => {
        this.route.navigateByUrl('/dd');
      },
    });
    console.log('get data', this.loginForm.value);
  }
}
