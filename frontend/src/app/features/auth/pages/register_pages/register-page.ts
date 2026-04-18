import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  nombre = '';
  apellidos = '';
  correo = '';
  telefono = '';
  password = '';
  confirmPassword = '';

  errorMessage = signal('');
  successMessage = signal('');
  loading = signal(false);

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.loading.set(true);

    this.authService.register({
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      telefono: this.telefono,
      password: this.password,
      confirmPassword: this.confirmPassword,
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.ok) {
          this.successMessage.set('Cuenta creada correctamente. Ahora inicia sesión.');
          setTimeout(() => this.router.navigate(['/login']), 1200);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error?.error?.message || 'No fue posible registrar el usuario.'
        );
      },
    });
  }
}