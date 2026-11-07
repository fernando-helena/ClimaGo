import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from './models';

interface StoredSession {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'climago_session';

  private readonly sessionSubject =
    new BehaviorSubject<StoredSession | null>(this.readSession());

  readonly user$ = this.sessionSubject.pipe(
    map(session => session?.user ?? null)
  );

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/login`, { email, password })
      .pipe(tap(response => this.saveResponse(response)));
  }

  register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
      .pipe(tap(response => this.saveResponse(response)));
  }

  get token(): string | null {
    return this.sessionSubject.value?.token ?? null;
  }

  get isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  updateUser(user: User): void {
    const current = this.sessionSubject.value;

    if (!current) return;

    this.persist({ ...current, user });
  }

  // Cierra la sesión en Laravel y limpia el almacenamiento local.
  logout(): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/logout`, {})
      .pipe(
        tap({
          next: () => this.clearLocalSession(),
          error: () => this.clearLocalSession()
        }),
        map(() => undefined)
      );
  }

  // Limpia únicamente la sesión del navegador.
  clearLocalSession(): void {
    localStorage.removeItem(this.storageKey);
    this.sessionSubject.next(null);
  }

  private saveResponse(response: AuthResponse): void {
    this.persist({
      token: response.token,
      user: response.user
    });
  }

  private persist(session: StoredSession): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  private readSession(): StoredSession | null {
    try {
      const value = localStorage.getItem(this.storageKey);

      return value ? JSON.parse(value) as StoredSession : null;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
