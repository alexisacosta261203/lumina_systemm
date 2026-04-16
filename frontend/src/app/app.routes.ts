import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home-page/home-page';
import { CourseListPage } from './features/courses/pages/course-list-page/course-list-page';
import { CourseDetailPage } from './features/courses/pages/course-detail-page/course-detail-page';
import { PurchasePage } from './features/purchase/pages/purchase-page/purchase-page';
import { ContactPage } from './features/contact/pages/contact-page/contact-page';
import { AdminCourseListPage } from './features/admin/pages/admin-course-list-page/admin-course-list-page';
import { AdminCourseFormPage } from './features/admin/pages/admin-course-form-page/admin-course-form-page';
import { NotFoundPage } from './shared/components/not-found-page/not-found-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'cursos', component: CourseListPage },
  { path: 'cursos/:id', component: CourseDetailPage },
  { path: 'comprar/:id', component: PurchasePage },
  { path: 'contacto', component: ContactPage },
  { path: 'admin/cursos', component: AdminCourseListPage },
  { path: 'admin/cursos/nuevo', component: AdminCourseFormPage },
  { path: 'admin/cursos/editar/:id', component: AdminCourseFormPage },
  { path: '**', component: NotFoundPage },
];