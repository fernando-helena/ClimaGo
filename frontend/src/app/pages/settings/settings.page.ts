import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage implements OnInit, OnDestroy {

  user: User | null = null;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        this.cdr.markForCheck();
      });

    this.api.currentUser().subscribe({
      next: user => {
        this.user = user;
        this.auth.updateUser(user);
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'No se pudieron actualizar los datos de tu cuenta.';
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.error = '';

    this.auth.logout().subscribe({
      next: () => {
        void this.router.navigateByUrl('/login', {
          replaceUrl: true
        });
      },
      error: () => {
        this.error = 'No se pudo cerrar la sesión.';
        this.cdr.markForCheck();
      }
    });
  }
}

