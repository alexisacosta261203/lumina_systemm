import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CourseCard } from '../../../../shared/components/course-card/course-card';
import { PurchasesService } from '../../../../core/services/purchases';
import { AuthService } from '../../../../core/services/auth';
import { UiNotificationsService } from '../../../../core/services/ui-notifications';
import { Course } from '../../../../shared/interfaces/course.interface';

@Component({
  selector: 'app-my-courses-page',
  standalone: true,
  imports: [],
  templateUrl: './my-courses-page.html',
  styleUrl: './my-courses-page.scss',
})
export class MyCoursesPage implements OnInit {
  private readonly purchasesService = inject(PurchasesService);
  private readonly authService = inject(AuthService);
  private readonly uiNotificationsService = inject(UiNotificationsService);
  private readonly router = inject(Router);

  courses: Course[] = [];
  loading = true;

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.uiNotificationsService.show(
        'Debes iniciar sesión para ver tus cursos.',
        'error'
      );
      this.router.navigate(['/login']);
      return;
    }

    this.loadPurchasedCourses();
  }

  loadPurchasedCourses(): void {
    this.loading = true;

    this.purchasesService.getMyPurchasedCourses().subscribe({
      next: (response) => {
        this.courses = response.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.courses = [];
        this.loading = false;

        this.uiNotificationsService.show(
          'No fue posible cargar tus cursos comprados.',
          'error'
        );
      },
    });
  }
goToCoursePurchase(courseId: number): void {
  this.router.navigate(['/mis-cursos', courseId]);
}
}