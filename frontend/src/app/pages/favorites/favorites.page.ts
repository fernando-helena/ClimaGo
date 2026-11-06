import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Favorite } from '../../core/models';

@Component({ selector: 'app-favorites', templateUrl: './favorites.page.html', standalone: false })
export class FavoritesPage implements OnInit {
  favorites: Favorite[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.load(); }
  ionViewWillEnter(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.favorites().subscribe({
      next: favorites => { this.favorites = favorites; this.loading = false; },
      error: err => { this.error = err.error?.message ?? 'No se pudieron cargar tus favoritos.'; this.loading = false; }
    });
  }

  remove(favorite: Favorite): void {
    this.api.deleteFavorite(favorite.id).subscribe({
      next: () => this.favorites = this.favorites.filter(item => item.id !== favorite.id),
      error: err => this.error = err.error?.message ?? 'No se pudo eliminar el favorito.'
    });
  }
}
