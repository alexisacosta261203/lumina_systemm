import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase } from '../../shared/interfaces/purchase.interface';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PurchasesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/compras`;

  createPurchase(purchase: Purchase): Observable<{ ok: boolean; message: string; id?: number }> {
    return this.http.post<{ ok: boolean; message: string; id?: number }>(
      this.apiUrl,
      purchase
    );
  }
}