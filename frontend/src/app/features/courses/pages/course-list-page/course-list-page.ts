import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../../../core/services/courses';
import { Course } from '../../../../shared/interfaces/course.interface';
import { CourseCard } from '../../../../shared/components/course-card/course-card';

@Component({
  selector: 'app-course-list-page',
  imports: [CourseCard],
  templateUrl: './course-list-page.html',
  styleUrl: './course-list-page.scss',
})
export class CourseListPage implements OnInit {
  private readonly coursesService = inject(CoursesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCategory = '';

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe((courses) => {
      this.courses = courses;

      this.route.queryParamMap.subscribe((params) => {
        const category = params.get('categoria') ?? '';
        this.selectedCategory = category;
        this.applyFilter(category);
      });
    });
  }

  applyFilter(category: string): void {
    if (!category) {
      this.filteredCourses = this.courses;
      return;
    }

    this.filteredCourses = this.courses.filter(
      (course) => course.categoria.toLowerCase() === category.toLowerCase()
    );
  }

  filterByCategory(category: string): void {
    if (!category) {
      this.router.navigate(['/cursos']);
      return;
    }

    this.router.navigate(['/cursos'], {
      queryParams: { categoria: category },
    });
  }

  goToPurchase(courseId: number): void {
    this.router.navigate(['/comprar', courseId]);
  }
}