import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  skills: string[];
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'https://stingray-app-wxhhn.ondigitalocean.app';

  private currentUser: User | null = null;
  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(
    name: string,
    username: string,
    email: string,
    password: string,
    bio: string,
    skills: string[],
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      name,
      username,
      email,
      password,
      bio,
      skills,
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  getAuthHeaders() {
    const token = this.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
