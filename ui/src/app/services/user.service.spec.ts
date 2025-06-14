import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../models/user';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/LoginRequest';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call registerUser and return the created user', () => {
    const mockUser: User = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      birthDate: '1990-01-01'
    };
    const pamUrl = 'http://localhost:8081/pam/register';

    service.registerUser(mockUser).subscribe((response) => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne(pamUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  describe('login', () => {
    it('should send login request and return token on success', () => {
      const loginRequest: LoginRequest = { email: 'test@example.com', password: 'password' };
      const mockResponse = { token: 'jwt-token' };

      service.login(loginRequest).subscribe(response => {
        expect(response.token).toBe('jwt-token');
      });

      const req = httpMock.expectOne('http://localhost:8080/gateway/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle server-side error', () => {
      const loginRequest: LoginRequest = { email: 'test@example.com', password: 'password' };
      const mockError = { message: 'Bad Request', status: 'BAD_REQUEST' };

      service.login(loginRequest).subscribe({
        next: () => fail('should have failed with a server error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('BAD_REQUEST');
          expect(error.message).toBe('Bad Request');
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/gateway/login');
      req.flush(mockError, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('handleError', () => {
    it('should handle client-side error', (done) => {
      const errorEvent = new ErrorEvent('Network error', { message: 'No Internet' });
      const httpError = new HttpErrorResponse({
        error: errorEvent,
        status: 0,
        statusText: 'Unknown Error'
      });

      // @ts-ignore: access private method for test
      service.handleError(httpError).subscribe({
        next: () => fail('should have failed with a client-side error'),
        error: (error) => {
          expect(error.status).toBe(0);
          expect(error.message).toContain('No Internet');
          done();
        }
      });
    });

    it('should handle server-side error', (done) => {
      const httpError = new HttpErrorResponse({
        error: { message: 'Server error', status: 'INTERNAL_SERVER_ERROR' },
        status: 500,
        statusText: 'Internal Server Error'
      });

      // @ts-ignore: access private method for test
      service.handleError(httpError).subscribe({
        next: () => fail('should have failed with a server-side error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('INTERNAL_SERVER_ERROR');
          expect(error.message).toBe('Server error');
          done();
        }
      });
    });
  });
});
