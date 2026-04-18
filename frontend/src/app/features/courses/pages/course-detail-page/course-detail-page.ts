import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses';
import { PurchasesService } from '../../../../core/services/purchases';
import { AuthService } from '../../../../core/services/auth';
import { Course } from '../../../../shared/interfaces/course.interface';

@Component({
  selector: 'app-course-detail-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './course-detail-page.html',
  styleUrl: './course-detail-page.scss',
})
export class CourseDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);
  private readonly purchasesService = inject(PurchasesService);
  private readonly authService = inject(AuthService);

  course?: Course;
  courseId = 0;
  isPurchased = false;
  loadingPurchaseStatus = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.courseId = id;

      if (!id) {
        this.course = undefined;
        this.isPurchased = false;
        return;
      }

      this.coursesService.getCourseById(id).subscribe((course) => {
        this.course = course;
      });

      this.checkPurchaseStatus(id);
    });
  }

  private checkPurchaseStatus(courseId: number): void {
    if (!this.authService.isAuthenticated()) {
      this.isPurchased = false;
      return;
    }

    this.loadingPurchaseStatus = true;

    this.purchasesService.hasPurchasedCourse(courseId).subscribe({
      next: (response) => {
        this.isPurchased = !!response.data?.purchased;
        this.loadingPurchaseStatus = false;
      },
      error: () => {
        this.isPurchased = false;
        this.loadingPurchaseStatus = false;
      },
    });
  }

  goToPurchase(): void {
    if (!this.course) {
      return;
    }

    if (this.isPurchased) {
      this.router.navigate(['/mis-cursos']);
      return;
    }

    this.router.navigate(['/comprar', this.course.id]);
  }

  goToMyCourses(): void {
    this.router.navigate(['/mis-cursos']);
  }
}