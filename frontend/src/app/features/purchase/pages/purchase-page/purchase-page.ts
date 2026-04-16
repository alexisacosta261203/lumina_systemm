import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses';
import { PurchasesService } from '../../../../core/services/purchases';
import { Course } from '../../../../shared/interfaces/course.interface';
import { Purchase } from '../../../../shared/interfaces/purchase.interface';
import { UiNotificationsService } from '../../../../core/services/ui-notifications';

@Component({
  selector: 'app-purchase-page',
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './purchase-page.html',
  styleUrl: './purchase-page.scss',
})
export class PurchasePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly purchasesService = inject(PurchasesService);
  private readonly uiNotificationsService = inject(UiNotificationsService);

  course?: Course;
  courseId = 0;

  purchaseData: Purchase = {
    cursoId: 0,
    nombreCliente: '',
    correoCliente: '',
    telefono: '',
    metodoPago: 'transferencia',
  };

  purchaseSuccess = false;
  purchaseMessage = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.courseId = id;
      this.purchaseData.cursoId = id;

      if (!id) {
        this.course = undefined;
        return;
      }

      this.coursesService.getCourseById(id).subscribe((course) => {
        this.course = course;
      });
    });
  }

  submitPurchase(): void {
    if (!this.course) {
      return;
    }

    this.purchasesService.createPurchase(this.purchaseData).subscribe((response) => {
      this.purchaseSuccess = response.ok;
      this.purchaseMessage = response.message;
      this.uiNotificationsService.show(
  response.message,
  response.ok ? 'success' : 'error'
);
    });
    
  }

  getPaymentInstructions(): string {
    switch (this.purchaseData.metodoPago) {
      case 'transferencia':
        return 'Realiza la transferencia y envia tu comprobante al correo del negocio para validar tu acceso.';
      case 'whatsapp':
        return 'Seras redirigido o contactado por WhatsApp para continuar con el proceso de pago.';
      case 'enlace':
        return 'Usa el enlace externo de pago que el negocio te compartira para completar tu compra.';
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