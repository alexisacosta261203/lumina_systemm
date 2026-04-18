import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${API_BASE_URL}/compras`;

  createPurchase(payload: {
    cursoId: number;
    metodoPago: string;
    comprobanteUrl?: string | null;
  }): Observable<{
    ok: boolean;
    message: string;
    id?: number;
    data?: {
      id: number;
      cursoId: number;
      tituloCurso: string;
      precioPagado: number;
      userId: number;
    };
  }> {
    return this.http.post<{
      ok: boolean;
      message: string;
      id?: number;
      data?: {
        id: number;
        cursoId: number;
        tituloCurso: string;
        precioPagado: number;
        userId: number;
      };
    }>(
      this.apiUrl,
      payload,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  getMyPurchasedCourseIds(): Observable<{
    ok: boolean;
    data: number[];
  }> {
    return this.http.get<{
      ok: boolean;
      data: number[];
    }>(`${this.apiUrl}/mine/course-ids`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  hasPurchasedCourse(cursoId: number): Observable<{
    ok: boolean;
    data: {
      purchased: boolean;
    };
  }> {
    return this.http.get<{
      ok: boolean;
      data: {
        purchased: boolean;
      };
    }>(`${this.apiUrl}/mine/has-course/${cursoId}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}