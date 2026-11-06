import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({ selector: 'app-register', templateUrl: './register.page.html', standalone: false })
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  passwordConfirmation = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    if (!this.name || !this.email || !this.password) {
      this.error = 'Completa todos los campos.';
      return;
    }
    if (this.password !== this.passwordConfirmation) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.auth.register(this.name, this.email, this.password, this.passwordConfirmation).subscribe({
      next: () => void this.router.navigateByUrl('/tabs/clima', { replaceUrl: true }),
      error: err => { this.error = err.error?.message ?? 'No se pudo crear la cuenta. Verifica los datos.'; this.loading = false; }
    });
  }
}
