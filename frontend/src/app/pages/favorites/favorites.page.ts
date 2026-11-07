import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiService } from '../../core/api.service';
import { Favorite } from '../../core/models';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: false
})
export class FavoritesPage {
  favorites: Favorite[] = [];
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ionViewWillEnter(): void {
    this.load();
  }

  load(): void {
    if (this.loading) return;

    this.loading = true;
    this.error = '';

    this.api.favorites()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: favorites => {
          this.favorites = favorites;
          this.cdr.markForCheck();
        },
        error: err => {
          this.error = err.error?.message
            ?? 'No se pudieron cargar tus favoritos.';
          this.cdr.markForCheck();
        }
      });
  }

  viewWeather(favorite: Favorite): void {
    this.router.navigate(['/tabs/clima'], {
      queryParams: {
        city: `${favorite.city}, ${favorite.country || ''}`
      }
    });
  }

  remove(favorite: Favorite): void {
    this.error = '';

    this.api.deleteFavorite(favorite.id)
      .pipe(
        finalize(() => {
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.favorites = this.favorites.filter(
            item => item.id !== favorite.id
          );
          this.cdr.markForCheck();
        },
        error: err => {
          this.error = err.error?.message
            ?? 'No se pudo eliminar el favorito.';
          this.cdr.markForCheck();
        }
      });
  }
}
