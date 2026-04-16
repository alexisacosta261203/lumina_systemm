import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses';
import { Course } from '../../../../shared/interfaces/course.interface';
import { CourseCard } from '../../../../shared/components/course-card/course-card';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, CourseCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  private readonly coursesService = inject(CoursesService);
  private readonly router = inject(Router);

  featuredCourses: Course[] = [];

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe((courses) => {
      this.featuredCourses = courses.slice(0, 3);
    });
  }

  goToCourses(): void {
    this.router.navigate(['/cursos']);
  }

  goToPurchase(courseId: number): void {
    this.router.navigate(['/comprar', courseId]);
  }
}