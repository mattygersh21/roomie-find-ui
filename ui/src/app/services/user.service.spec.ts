import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../models/user';
import { provideHttpClient } from '@angular/common/http';

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
    const apiUrl = 'http://localhost:8081/pam/register';

    service.registerUser(mockUser).subscribe((response) => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });
});
