import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminCoursesService } from '../../../../core/services/admin-courses';
import { Course } from '../../../../shared/interfaces/course.interface';
import { UiNotificationsService } from '../../../../core/services/ui-notifications';

@Component({
  selector: 'app-admin-course-list-page',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './admin-course-list-page.html',
  styleUrl: './admin-course-list-page.scss',
})
export class AdminCourseListPage implements OnInit {
  private readonly adminCoursesService = inject(AdminCoursesService);
  private readonly router = inject(Router);
  private readonly uiNotificationsService = inject(UiNotificationsService);

  courses: Course[] = [];
  responseMessage = '';

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.adminCoursesService.getCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

  goToNewCourse(): void {
    this.router.navigate(['/admin/cursos/nuevo']);
  }

  goToEditCourse(courseId: number): void {
    this.router.navigate(['/admin/cursos/editar', courseId]);
  }

  deleteCourse(courseId: number): void {
    this.adminCoursesService.deleteCourse(courseId).subscribe((response) => {
      this.responseMessage = response.message;
      this.loadCourses();
      this.uiNotificationsService.show(
  response.message,
  response.ok ? 'success' : 'error'
);
    });
    
  }
}