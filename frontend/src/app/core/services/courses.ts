import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Course } from '../../shared/interfaces/course.interface';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/cursos`;

  getCourses(): Observable<Course[]> {
    return this.http
      .get<{ ok: boolean; data: Course[] }>(this.apiUrl)
      .pipe(
        map((response) => response.data),
        catchError(() => of([]))
      );
  }

  getCourseById(id: number): Observable<Course | undefined> {
    return this.http
      .get<{ ok: boolean; data: Course }>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response.data),
        catchError(() => of(undefined))
      );
  }
}