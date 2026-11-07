import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ApiService } from '../../core/api.service';
import { SearchHistory } from '../../core/models';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: false
})
export class HistoryPage {
  history: SearchHistory[] = [];
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

    this.api.history()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: history => {
          this.history = history;
          this.cdr.markForCheck();
        },
        error: err => {
          this.error = err.error?.message
            ?? 'No se pudo cargar el historial.';
          this.cdr.markForCheck();
        }
      });
  }

  viewWeather(item: SearchHistory): void {
    this.router.navigate(['/tabs/clima'], {
      queryParams: {
        city: `${item.city}, ${item.country || ''}`
      }
    });
  }
}
