import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { SearchHistory } from '../../core/models';

@Component({ selector: 'app-history', templateUrl: './history.page.html', standalone: false })
export class HistoryPage implements OnInit {
  history: SearchHistory[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }
  ionViewWillEnter(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.history().subscribe({
      next: history => { this.history = history; this.loading = false; },
      error: err => { this.error = err.error?.message ?? 'No se pudo cargar el historial.'; this.loading = false; }
    });
  }
}
