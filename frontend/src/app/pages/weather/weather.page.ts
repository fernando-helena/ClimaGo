import { Component } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { WeatherResponse } from '../../core/models';

@Component({ selector: 'app-weather', templateUrl: './weather.page.html', styleUrls: ['./weather.page.scss'], standalone: false })
export class WeatherPage {
  city = '';
  weather?: WeatherResponse;
  loading = false;
  savingFavorite = false;
  error = '';
  message = '';

  constructor(private api: ApiService) {}

  search(): void {
    if (!this.city.trim()) { this.error = 'Escribe una ciudad. Para mejores resultados incluye el país.'; return; }
    this.loading = true;
    this.error = '';
    this.message = '';
    this.api.weather(this.city.trim()).subscribe({
      next: weather => { this.weather = weather; this.loading = false; },
      error: err => { this.error = err.error?.message ?? 'No se encontró el clima solicitado.'; this.loading = false; }
    });
  }

  addFavorite(): void {
    const location = this.weather?.location;
    if (!location?.name) return;
    this.savingFavorite = true;
    this.message = '';
    this.api.addFavorite({ city: location.name, country: location.country, latitude: location.lat, longitude: location.lon }).subscribe({
      next: () => { this.message = 'Ciudad agregada a favoritos.'; this.savingFavorite = false; },
      error: err => { this.error = err.error?.message ?? 'No se pudo agregar el favorito.'; this.savingFavorite = false; }
    });
  }
}
