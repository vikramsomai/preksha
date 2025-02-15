import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/component/footer/footer.component';
import { SiteHeaderComponent } from '../../shared/component/site-header/site-header.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [
    FooterComponent,
    SiteHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.scss',
})
export class UserSignupComponent {
  constructor(private authService: AuthService, private route: Router) {}
  signupForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  handleSignup() {
    const payload = {
      firstname: this.signupForm.value.firstname || '',
      lastname: this.signupForm.value.lastname || '',
      email: this.signupForm.value.email || '',
      password: this.signupForm.value.password || '',
    };
    this.authService.register(payload).subscribe({
      next: (Response) => {
        this.route.navigateByUrl('/login');
      },
    });
  }
}
