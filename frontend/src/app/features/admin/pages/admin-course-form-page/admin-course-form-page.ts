import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminCoursesService } from '../../../../core/services/admin-courses';
import { Course } from '../../../../shared/interfaces/course.interface';
import { noWhitespaceValidator } from '../../../../shared/utils/no-whitespace.validator';
import { UiNotificationsService } from '../../../../core/services/ui-notifications';

@Component({
  selector: 'app-admin-course-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-course-form-page.html',
  styleUrl: './admin-course-form-page.scss',
})
export class AdminCourseFormPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminCoursesService = inject(AdminCoursesService);
  private readonly uiNotificationsService = inject(UiNotificationsService);

  isEditMode = false;
  courseId = 0;
  formSubmitted = false;
  responseMessage = '';
  responseSuccess = false;

  adminCourseForm = this.formBuilder.group({
    titulo: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(80),
          noWhitespaceValidator(),
      ],
    ],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(300),
          noWhitespaceValidator(),
      ],
    ],
    imagenUrl: [
      'https://placehold.co/600x400?text=Nuevo+Curso',
      [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern(/^https?:\/\/.+/),
      ],
    ],
    precio: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(50000),
      ],
    ],
    categoria: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
          noWhitespaceValidator(),
      ],
    ],
    duracionHoras: [
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(200),
      ],
    ],
    nivel: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^(Basico|Intermedio|Avanzado)$/),
      ],
    ],
    estadoCurso: [
      'activo',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(activo|inactivo)$/),
      ],
    ],
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (!idParam) {
        this.isEditMode = false;
        this.courseId = 0;
        return;
      }

      const id = Number(idParam);
      this.isEditMode = true;
      this.courseId = id;

      this.adminCoursesService.getCourseById(id).subscribe((course) => {
        if (!course) {
          this.responseSuccess = false;
          this.responseMessage = `No existe un curso con id ${id}.`;
          this.uiNotificationsService.show(this.responseMessage, 'error');
          return;

        }

        this.adminCourseForm.patchValue({
          titulo: course.titulo,
          descripcion: course.descripcion,
          imagenUrl: course.imagenUrl,
          precio: course.precio,
          categoria: course.categoria,
          duracionHoras: course.duracionHoras,
          nivel: course.nivel,
          estadoCurso: course.activo ? 'activo' : 'inactivo',
        });
      });
    });
  }

  get f() {
    return this.adminCourseForm.controls;
  }

  saveCourse(): void {
    this.formSubmitted = true;
    this.responseMessage = '';

    if (this.adminCourseForm.invalid) {
      this.responseSuccess = false;
      this.responseMessage = 'Corrige los campos marcados antes de guardar.';
      this.adminCourseForm.markAllAsTouched();
      return;
    }

    const formValue = this.adminCourseForm.getRawValue();

    const courseData: Course = {
      id: this.courseId,
      titulo: formValue.titulo ?? '',
      descripcion: formValue.descripcion ?? '',
      imagenUrl: formValue.imagenUrl ?? '',
      precio: Number(formValue.precio ?? 0),
      categoria: formValue.categoria ?? '',
      duracionHoras: Number(formValue.duracionHoras ?? 0),
      nivel: formValue.nivel ?? '',
      activo: formValue.estadoCurso === 'activo',
    };

    if (this.isEditMode) {
      this.adminCoursesService.updateCourse(this.courseId, courseData).subscribe((response) => {
        this.responseSuccess = response.ok;
        this.responseMessage = response.message;
        this.uiNotificationsService.show(
  response.message,
  response.ok ? 'success' : 'error'
);
      });
      return;
    }

    this.adminCoursesService.createCourse(courseData).subscribe((response) => {
      this.responseSuccess = response.ok;
      this.responseMessage = response.message;
      this.uiNotificationsService.show(
  response.message,
  response.ok ? 'success' : 'error'
);

      if (response.ok) {
        this.adminCourseForm.reset({
          titulo: '',
          descripcion: '',
          imagenUrl: 'https://placehold.co/600x400?text=Nuevo+Curso',
          precio: 1,
          categoria: '',
          duracionHoras: 1,
          nivel: '',
          estadoCurso: 'activo',
        });
        this.formSubmitted = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/cursos']);
  }
}