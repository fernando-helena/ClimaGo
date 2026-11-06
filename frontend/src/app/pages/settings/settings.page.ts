import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { User } from '../../core/models';

@Component({ selector: 'app-settings', templateUrl: './settings.page.html', standalone: false })
export class SettingsPage implements OnInit {
  user: User | null = null;
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => this.user = user);
    this.api.currentUser().subscribe({
      next: user => { this.user = user; this.auth.updateUser(user); },
      error: () => this.error = 'No se pudieron actualizar los datos de tu cuenta.'
    });
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
