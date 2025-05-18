import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  createAccountForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.createAccountForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthDate: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.createAccountForm.valid) {
      const formData = this.createAccountForm.value;

      const user: User = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate
      };

      this.userService.registerUser(user).subscribe({
        next: () => alert('Registration successful'),
        error: () => alert('Registration failed')
      });

      this.createAccountForm.controls['password'].reset();
    }
  }
}
