import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Favorite, SearchHistory, User, WeatherResponse } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  weather(city: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${environment.apiUrl}/weather`, { params: { city } });
  }

  favorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[] | { data: Favorite[] }>(`${environment.apiUrl}/favorites`)
      .pipe(map(response => this.asList(response)));
  }

  addFavorite(favorite: Omit<Favorite, 'id'>): Observable<Favorite> {
  return this.http.post<{ message: string; favorite: Favorite }>(
    `${environment.apiUrl}/favorites`,
    favorite
  ).pipe(
    map(response => response.favorite)
  );
}

  deleteFavorite(id: number): Observable<unknown> {
    return this.http.delete(`${environment.apiUrl}/favorites/${id}`);
  }

  history(): Observable<SearchHistory[]> {
    return this.http.get<SearchHistory[] | { data: SearchHistory[] }>(`${environment.apiUrl}/history`)
      .pipe(map(response => this.asList(response)));
  }

  currentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user`);
  }

  private asList<T>(response: T[] | { data: T[] }): T[] {
    return Array.isArray(response) ? response : response.data ?? [];
  }
}
