import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccountComponent } from './create-account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['registerUser']);

    await TestBed.configureTestingModule({
      declarations: [CreateAccountComponent],
      imports: [
        BrowserAnimationsModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with the required controls', () => {
    expect(component.createAccountForm.contains('firstName')).toBeTruthy();
    expect(component.createAccountForm.contains('lastName')).toBeTruthy();
    expect(component.createAccountForm.contains('email')).toBeTruthy();
    expect(component.createAccountForm.contains('password')).toBeTruthy();
    expect(component.createAccountForm.contains('birthDate')).toBeTruthy();
  });

  it('should mark the form as invalid if required fields are empty', () => {
    component.createAccountForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthDate: '',
    });
    expect(component.createAccountForm.valid).toBeFalsy();
  });

  describe('Tests with valid form settings', () => {
    let firstName = 'John';
    let lastName = 'Doe';
    let email = 'john.doe@example.com';
    let password = 'password123';
    let birthDate = '2025-05-07T05:00:00.000Z';

    beforeEach(() => {
      component.createAccountForm.setValue({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        birthDate: birthDate,
      });
    });

    it('should mark the form as valid if all fields are filled correctly', () => {
      expect(component.createAccountForm.valid).toBeTruthy();
    });

    it('should call UserService.registerUser on valid form submission', () => {
      userServiceSpy.registerUser.and.returnValue(of({} as any));

      component.onSubmit();

      expect(userServiceSpy.registerUser).toHaveBeenCalled();
    });

    it('should alert success message on successful registration', () => {
      spyOn(window, 'alert');
      userServiceSpy.registerUser.and.returnValue(of({} as any));

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('Registration successful');
    });

    it('should alert error message on registration failure', () => {
      spyOn(window, 'alert');
      userServiceSpy.registerUser.and.returnValue(throwError(() => new Error('Registration failed')));

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('Registration failed');
    });

    it('should reset the password field after form submission', () => {
      userServiceSpy.registerUser.and.returnValue(of({} as any));

      component.onSubmit();

      expect(component.createAccountForm.controls['password'].value).toBeNull();
    });
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeTrue();
  });
});