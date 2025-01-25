import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatDividerModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
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

  it('should log the form value on submit if valid', () => {
    spyOn(console, 'log');
    let testEmail: string = 'test@user.com';
    let testPassword: string = 'password123';
    component.loginForm.get('email')?.setValue(testEmail);
    component.loginForm.get('password')?.setValue(testPassword);
    component.onSubmit();
    expect(console.log).toHaveBeenCalledWith('Login form data:', {
      email: testEmail,
      password: testPassword,
    });
  });

  it('should not log the form value on submit if invalid', () => {
    spyOn(console, 'log');
    component.loginForm.get('username')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    component.onSubmit();
    expect(console.log).not.toHaveBeenCalled();
  });
});
