import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../../shared/interfaces/contact.interface';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/contacto`;

  sendMessage(contact: Contact): Observable<{ ok: boolean; message: string; id?: number }> {
    return this.http.post<{ ok: boolean; message: string; id?: number }>(
      this.apiUrl,
      contact
    );
  }
}