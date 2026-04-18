import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses';
import { PurchasesService } from '../../../../core/services/purchases';
import { AuthService } from '../../../../core/services/auth';
import { UiNotificationsService } from '../../../../core/services/ui-notifications';
import { Course } from '../../../../shared/interfaces/course.interface';

@Component({
  selector: 'app-my-course-detail-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './my-course-detail-page.html',
  styleUrl: './my-course-detail-page.scss',
})
export class MyCourseDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly purchasesService = inject(PurchasesService);
  private readonly authService = inject(AuthService);
  private readonly uiNotificationsService = inject(UiNotificationsService);

  course?: Course;
  courseId = 0;
  loading = true;
  accessGranted = false;

  readonly modules = [
    {
      titulo: 'Modulo 1. Introduccion al curso',
      descripcion: 'Presentacion general, objetivos y materiales recomendados.',
    },
    {
      titulo: 'Modulo 2. Fundamentos principales',
      descripcion: 'Conceptos base para comprender el flujo de trabajo del curso.',
    },
    {
      titulo: 'Modulo 3. Practica guiada',
      descripcion: 'Ejercicios y ejemplos para reforzar lo aprendido.',
    },
    {
      titulo: 'Modulo 4. Proyecto final',
      descripcion: 'Actividad de cierre para aplicar los conocimientos del curso.',
    },
  ];

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.uiNotificationsService.show(
        'Debes iniciar sesión para acceder a tu curso.',
        'error'
      );
      this.router.navigate(['/login']);
      return;
    }

    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.courseId) {
      this.uiNotificationsService.show('Curso inválido.', 'error');
      this.router.navigate(['/mis-cursos']);
      return;
    }

    this.validateAccessAndLoadCourse();
  }

  private validateAccessAndLoadCourse(): void {
    this.loading = true;

    this.purchasesService.hasPurchasedCourse(this.courseId).subscribe({
      next: (response) => {
        const purchased = !!response.data?.purchased;

        if (!purchased) {
          this.accessGranted = false;
          this.loading = false;
          this.uiNotificationsService.show(
            'No tienes acceso a este curso.',
            'error'
          );
          this.router.navigate(['/mis-cursos']);
          return;
        }

        this.accessGranted = true;

        this.coursesService.getCourseById(this.courseId).subscribe({
          next: (course) => {
            this.course = course;
            this.loading = false;

            if (!course) {
              this.uiNotificationsService.show(
                'No se encontró la información del curso.',
                'error'
              );
              this.router.navigate(['/mis-cursos']);
            }
          },
          error: () => {
            this.loading = false;
            this.uiNotificationsService.show(
              'No fue posible cargar el curso.',
              'error'
            );
            this.router.navigate(['/mis-cursos']);
          },
        });
      },
      error: () => {
        this.loading = false;
        this.uiNotificationsService.show(
          'No fue posible validar tu acceso al curso.',
          'error'
        );
        this.router.navigate(['/mis-cursos']);
      },
    });
  }

  goBackToMyCourses(): void {
    this.router.navigate(['/mis-cursos']);
  }
}