import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses';
import { PurchasesService } from '../../../../core/services/purchases';
import { AuthService } from '../../../../core/services/auth';
import { Course } from '../../../../shared/interfaces/course.interface';
import { UiNotificationsService } from '../../../../core/services/ui-notifications';

@Component({
  selector: 'app-purchase-page',
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './purchase-page.html',
  styleUrl: './purchase-page.scss',
})
export class PurchasePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly purchasesService = inject(PurchasesService);
  private readonly authService = inject(AuthService);
  private readonly uiNotificationsService = inject(UiNotificationsService);

  course?: Course;
  courseId = 0;

  nombreCliente = '';
  correoCliente = '';
  telefono = '';

  purchaseData = {
    cursoId: 0,
    metodoPago: 'transferencia',
    comprobanteUrl: null as string | null,
  };

  purchaseSuccess = false;
  purchaseMessage = '';
  loadingPurchase = false;
  alreadyPurchased = false;
  checkingPurchase = true;

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.uiNotificationsService.show(
        'Debes iniciar sesión para comprar un curso.',
        'error'
      );
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.user();

    if (user) {
      this.nombreCliente = `${user.nombre} ${user.apellidos}`.trim();
      this.correoCliente = user.correo;
      this.telefono = user.telefono;
    }

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.courseId = id;
      this.purchaseData.cursoId = id;

      if (!id) {
        this.course = undefined;
        this.checkingPurchase = false;
        return;
      }

      this.coursesService.getCourseById(id).subscribe({
        next: (course) => {
          this.course = course;
        },
        error: () => {
          this.course = undefined;
        },
      });

      this.purchasesService.hasPurchasedCourse(id).subscribe({
        next: (response) => {
          this.alreadyPurchased = !!response.data?.purchased;
          this.checkingPurchase = false;
        },
        error: () => {
          this.alreadyPurchased = false;
          this.checkingPurchase = false;
        },
      });
    });
  }

  submitPurchase(): void {
    if (!this.course) {
      this.uiNotificationsService.show(
        'No existe un curso válido para comprar.',
        'error'
      );
      return;
    }

    if (this.alreadyPurchased) {
      this.uiNotificationsService.show(
        'Ya compraste este curso.',
        'error'
      );
      return;
    }

    if (!this.purchaseData.metodoPago) {
      this.uiNotificationsService.show(
        'Debes seleccionar un método de pago.',
        'error'
      );
      return;
    }

    this.loadingPurchase = true;
    this.purchaseSuccess = false;
    this.purchaseMessage = '';

    this.purchasesService.createPurchase({
      cursoId: this.purchaseData.cursoId,
      metodoPago: this.purchaseData.metodoPago,
      comprobanteUrl: this.purchaseData.comprobanteUrl,
    }).subscribe({
      next: (response) => {
        this.loadingPurchase = false;
        this.purchaseSuccess = response.ok;
        this.purchaseMessage = response.message;
        this.alreadyPurchased = true;

        this.uiNotificationsService.show(
          response.message,
          response.ok ? 'success' : 'error'
        );
      },
      error: (error) => {
        this.loadingPurchase = false;

        const message =
          error?.error?.message || 'No fue posible registrar la compra.';

        if (error?.status === 409) {
          this.alreadyPurchased = true;
        }

        this.purchaseSuccess = false;
        this.purchaseMessage = message;

        this.uiNotificationsService.show(message, 'error');
      },
    });
  }

  getPaymentInstructions(): string {
    switch (this.purchaseData.metodoPago) {
      case 'transferencia':
        return 'Realiza la transferencia y conserva tu comprobante mientras validamos tu acceso.';
      case 'enlace':
        return 'Usa el enlace externo de pago que se te proporcionará para completar la compra.';
      default:
        return '';
    }
  }

  goBackToCourse(): void {
    if (!this.courseId) {
      this.router.navigate(['/cursos']);
      return;
    }

    this.router.navigate(['/cursos', this.courseId]);
  }
}