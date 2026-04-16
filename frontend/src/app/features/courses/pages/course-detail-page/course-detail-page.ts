import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses';
import { Course } from '../../../../shared/interfaces/course.interface';

@Component({
  selector: 'app-course-detail-page',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './course-detail-page.html',
  styleUrl: './course-detail-page.scss',
})
export class CourseDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coursesService = inject(CoursesService);

  course?: Course;
  courseId = 0;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.courseId = id;

      if (!id) {
        this.course = undefined;
        return;
      }

      this.coursesService.getCourseById(id).subscribe((course) => {
        this.course = course;
      });
    });
  }

  goToPurchase(): void {
    if (!this.course) {
      return;
    }

    this.router.navigate(['/comprar', this.course.id]);
  }
}