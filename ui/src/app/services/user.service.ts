import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/pam/register';

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
