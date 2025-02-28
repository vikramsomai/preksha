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
import { Router, RouterLink } from '@angular/router';
import { FormErrorComponent } from '../../shared/component/form-error/form-error.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    FooterComponent,
    SiteHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    FormErrorComponent,
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class UserLoginComponent {
  loginError!: string;
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
      next: (Response: any) => {
        this.route.navigateByUrl('/dd');
      },
      error: (error: HttpErrorResponse) => {
        // this.loginError = error.error.error;
      },
    });
  }
}
