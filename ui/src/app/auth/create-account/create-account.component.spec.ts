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

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;

  beforeEach(async () => {
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

  it('should mark the form as valid if all fields are filled correctly', () => {
    component.createAccountForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      birthDate: new Date('2000-01-01'),
    });
    expect(component.createAccountForm.valid).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeTrue();
  });

  it('should call onSubmit when the form is submitted', () => {
    spyOn(component, 'onSubmit');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should log the form values on valid form submission', () => {
    spyOn(console, 'log');
    component.createAccountForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      birthDate: new Date('2000-01-01'),
    });
    component.onSubmit();
    expect(console.log).toHaveBeenCalledWith('Form Submitted', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      birthDate: new Date('2000-01-01'),
    });
  });

  it('should disable the submit button if the form is invalid', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(button.disabled).toBeTrue();

    component.createAccountForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      birthDate: new Date('2000-01-01'),
    });
    fixture.detectChanges();
    expect(button.disabled).toBeFalse();
  });
});
