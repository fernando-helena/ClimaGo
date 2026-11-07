import {
  Component,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Chart, registerables } from 'chart.js';

import { ApiService } from '../../core/api.service';
import { WeatherResponse } from '../../core/models';

Chart.register(...registerables);

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: false
})
export class WeatherPage implements OnDestroy {

  city = '';
  weather?: WeatherResponse;
  loading = false;
  savingFavorite = false;
  error = '';
  message = '';

  private temperatureChart?: Chart;

  @ViewChild('temperatureChart')
  chartCanvas?: ElementRef<HTMLCanvasElement>;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ionViewWillEnter(): void {
    const city = this.route.snapshot.queryParamMap.get('city');

    if (city) {
      this.city = city;
      this.search();

      // Limpiar el parámetro para evitar búsquedas repetidas.
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { city: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  search(): void {
    const city = this.city.trim();

    if (!city) {
      this.error = 'Escribe una ciudad. Para mejores resultados incluye el país.';
      return;
    }

    if (this.loading) return;

    this.loading = true;
    this.error = '';
    this.message = '';

    this.api.weather(city)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: weather => {
          this.destroyChart();
          this.weather = weather;

          // Actualizar la vista antes de crear la gráfica.
          this.cdr.detectChanges();

          // Dibujar nuevamente la gráfica.
          if (this.chartCanvas) {
            this.createChart(this.chartCanvas.nativeElement);
          }
        },
        error: err => {
          this.error = err.error?.message
            ?? 'No se encontró el clima solicitado.';

          this.cdr.markForCheck();
        }
      });
  }

  private createChart(canvas: HTMLCanvasElement): void {
    const hours = this.weather?.forecast?.forecastday?.[0]?.hour;

    if (!hours?.length) return;

    this.destroyChart();

    const labels = hours.map(hour => {
      if (!hour.time) return '';

      return hour.time.split(' ')[1]?.slice(0, 5) ?? '';
    });

    const temperatures = hours.map(hour => hour.temp_c ?? 0);

    this.temperatureChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Temperatura',
            data: temperatures,
            borderColor: '#438b3d',
            backgroundColor: 'rgba(104, 185, 55, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#438b3d',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: context => `${context.parsed.y} °C`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#7b857e',
              maxTicksLimit: 8
            }
          },
          y: {
            grid: {
              color: '#edf0ed'
            },
            ticks: {
              color: '#7b857e',
              callback: value => `${value} °C`
            }
          }
        }
      }
    });
  }

  private destroyChart(): void {
    this.temperatureChart?.destroy();
    this.temperatureChart = undefined;
  }

  addFavorite(): void {
    const location = this.weather?.location;

    if (!location?.name || this.savingFavorite) return;

    this.savingFavorite = true;
    this.message = '';
    this.error = '';

    this.api.addFavorite({
      city: location.name,
      country: location.country,
      latitude: location.lat,
      longitude: location.lon
    })
      .pipe(finalize(() => {
        this.savingFavorite = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: () => {
          this.message = 'Ciudad agregada a favoritos.';
          this.cdr.markForCheck();
        },
        error: err => {
          this.error = err.error?.message
            ?? 'No se pudo agregar el favorito.';

          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }
}

