import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe(
        (response: any) => {
          localStorage.setItem('jwt', response.token);
          // this.router.navigate(['/dashboard']);
        },
        error => {
          alert(`${error.message}\n\nError:\n${error.status}\n${error.statusText}\n`);
          // TODO: Add proper logging
          // console.error('Login failed:', error);
        }
      );
    }
  }

  createAccount() {
    this.router.navigate(['/auth/create-account']);
    console.log('Redirect to account creation page.');
  }
}
