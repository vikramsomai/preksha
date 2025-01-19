import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
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
        console.log('login suceess');
      },
    });
    console.log('get data', this.loginForm.value);
  }
  handleSignup() {
    const payload = {
      firstname: this.signupForm.value.firstname || '',
      lastname: this.signupForm.value.lastname || '',
      email: this.signupForm.value.email || '',
      password: this.signupForm.value.password || '',
    };
    this.authService.register(payload).subscribe({
      next: (Response) => {
        console.log('success');
      },
    });

    console.log('signup', this.signupForm.value);
  }
}
