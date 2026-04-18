import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  correo = '';
  password = '';
  errorMessage = signal('');
  loading = signal(false);

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.correo || !this.password) {
      this.errorMessage.set('Correo y contraseña son obligatorios.');
      return;
    }

    this.loading.set(true);

    this.authService.login({
      correo: this.correo,
      password: this.password,
    }).subscribe({
      next: (response) => {
        this.loading.set(false);

        if (response.ok) {
          if (response.user?.role === 'admin') {
            this.router.navigate(['/admin/cursos']);
            return;
          }

          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error?.error?.message || 'No fue posible iniciar sesión.'
        );
      },
    });
  }
}