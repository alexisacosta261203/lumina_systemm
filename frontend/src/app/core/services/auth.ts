import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { LoginRequest } from '../../shared/interfaces/login-request.interface';
import { RegisterRequest } from '../../shared/interfaces/register-request.interface';
import { AuthResponse } from '../../shared/interfaces/auth-response.interface';
import { AuthUser } from '../../shared/interfaces/auth-user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/auth`;

  private readonly tokenSignal = signal<string | null>(localStorage.getItem('auth_token'));
  private readonly userSignal = signal<AuthUser | null>(this.getStoredUser());

  readonly token = computed(() => this.tokenSignal());
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        if (response.ok && response.token && response.user) {
          this.setSession(response.token, response.user);
        }
      })
    );
  }

  me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      tap((response) => {
        if (response.ok && response.data) {
          this.userSignal.set(response.data);
          localStorage.setItem('auth_user', JSON.stringify(response.data));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private setSession(token: string, user: AuthUser): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.tokenSignal.set(token);
    this.userSignal.set(user);
  }

  private getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.tokenSignal();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  confirmAdminPassword(password: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(
    `${this.apiUrl}/confirm-admin-password`,
    { password },
    {
      headers: this.getAuthHeaders(),
    }
  );
}
}