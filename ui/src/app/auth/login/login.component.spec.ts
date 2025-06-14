import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatDividerModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    const form = component.loginForm;
    expect(form).toBeTruthy();
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
  });

  it('should mark form as invalid if fields are empty', () => {
    const form = component.loginForm;
    form.get('email')?.setValue('');
    form.get('password')?.setValue('');
    expect(form.valid).toBeFalse();
  });

  it('should mark form as valid if fields are filled', () => {
    const form = component.loginForm;
    form.get('email')?.setValue('test@user.com');
    form.get('password')?.setValue('password123');
    expect(form.valid).toBeTrue();
  });

  it('should disable the login button if the form is invalid', () => {
    const button = fixture.debugElement.query(By.css('button[mat-raised-button]')).nativeElement;
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();
  });

  it('should enable the login button if the form is valid', () => {
    const button = fixture.debugElement.query(By.css('button[mat-raised-button]')).nativeElement;
    component.loginForm.get('email')?.setValue('test@user.com');
    component.loginForm.get('password')?.setValue('password123');
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });

  describe('onSubmit', () => {
    it('should call UserService.login with form value on submit if valid', () => {
      let testEmail: string = 'test@user.com';
      let testPassword: string = 'password123';
      userServiceSpy.login.and.returnValue(of({ token: 'dummy' }));

      component.loginForm.get('email')?.setValue(testEmail);
      component.loginForm.get('password')?.setValue(testPassword);
      component.onSubmit();

      expect(userServiceSpy.login).toHaveBeenCalledWith({ email: testEmail, password: testPassword });
    });

    it('should not log the form value on submit if invalid', () => {
      userServiceSpy.login.and.returnValue(of({ token: 'dummy' }));

      component.loginForm.get('email')?.setValue('');
      component.loginForm.get('password')?.setValue('');
      component.onSubmit();

      expect(userServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should call UserService.login and save JWT on successful login if form is valid', () => {
      const mockToken = 'jwt-token';
      spyOn(localStorage, 'setItem');
      userServiceSpy.login.and.returnValue(of({ token: mockToken }));

      component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
      component.onSubmit();

      expect(userServiceSpy.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(localStorage.setItem).toHaveBeenCalledWith('jwt', mockToken);
      // Uncomment if you enable navigation after login
      // expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should show alert and log error on login failure', () => {
      spyOn(window, 'alert');
      // spyOn(console, 'error'); // Uncomment if you want to check console.error

      const errorObj = { status: 401, statusText: 'UNAUTHORIZED', message: 'Invalid credentials' };
      userServiceSpy.login.and.returnValue(throwError(() => errorObj));

      component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpass' });
      component.onSubmit();

      expect(userServiceSpy.login).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(
        'Invalid credentials\n\nError:\n401\nUNAUTHORIZED\n'
      );
      // expect(console.error).toHaveBeenCalledWith('Login failed:', errorObj);
    });

    it('should not call UserService.login if form is invalid', () => {
      component.loginForm.setValue({ email: '', password: '' });
      component.onSubmit();
      expect(userServiceSpy.login).not.toHaveBeenCalled();
    });
  });
});
