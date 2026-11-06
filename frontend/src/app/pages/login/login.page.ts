import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({ selector: 'app-login', templateUrl: './login.page.html', styleUrls: ['./login.page.scss'], standalone: false })
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isAuthenticated) void router.navigateByUrl('/tabs/clima', { replaceUrl: true });
  }

  submit(): void {
    if (!this.email || !this.password) {
      this.error = 'Ingresa tu correo y contraseña.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => void this.router.navigateByUrl('/tabs/clima', { replaceUrl: true }),
      error: err => { this.error = err.error?.message ?? 'No se pudo iniciar sesión. Revisa tus datos y la conexión con la API.'; this.loading = false; }
    });
  }
}
