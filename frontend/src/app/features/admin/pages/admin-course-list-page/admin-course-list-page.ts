import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminCoursesService } from '../../../../core/services/admin-courses';
import { AuthService } from '../../../../core/services/auth';
import { Course } from '../../../../shared/interfaces/course.interface';

@Component({
  selector: 'app-admin-course-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-course-list-page.html',
  styleUrl: './admin-course-list-page.scss',
})
export class AdminCourseListPage {
  private readonly adminCoursesService = inject(AdminCoursesService);
  private readonly authService = inject(AuthService);

  courses = signal<Course[]>([]);
  loading = signal(true);

  showDeleteModal = signal(false);
  selectedCourse = signal<Course | null>(null);
  adminPassword = signal('');
  deleteError = signal('');
  deleteLoading = signal(false);

  constructor() {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading.set(true);

    this.adminCoursesService.getCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  openDeleteModal(course: Course): void {
    this.selectedCourse.set(course);
    this.adminPassword.set('');
    this.deleteError.set('');
    this.deleteLoading.set(false);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedCourse.set(null);
    this.adminPassword.set('');
    this.deleteError.set('');
    this.deleteLoading.set(false);
  }

  onPasswordInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.adminPassword.set(value);
  }

  confirmDelete(): void {
    const course = this.selectedCourse();

    if (!course) {
      return;
    }

    if (!this.adminPassword().trim()) {
      this.deleteError.set('Debes ingresar la contraseña de administrador.');
      return;
    }

    this.deleteError.set('');
    this.deleteLoading.set(true);

    this.authService.confirmAdminPassword(this.adminPassword()).subscribe({
      next: (response) => {
        if (response.ok) {
          this.adminCoursesService.deleteCourse(course.id).subscribe({
            next: () => {
              this.deleteLoading.set(false);
              this.closeDeleteModal();
              this.loadCourses();
            },
            error: (error) => {
              this.deleteLoading.set(false);
              this.deleteError.set(
                error?.error?.message || 'No fue posible eliminar el curso.'
              );
            },
          });
        }
      },
      error: (error) => {
        this.deleteLoading.set(false);
        this.deleteError.set(
          error?.error?.message || 'La contraseña de administrador no es correcta.'
        );
      },
    });
  }
}