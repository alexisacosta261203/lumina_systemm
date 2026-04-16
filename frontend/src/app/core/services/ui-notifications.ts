import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiNotificationsService {
  readonly message = signal('');
  readonly type = signal<'success' | 'error' | ''>('');

  show(message: string, type: 'success' | 'error' = 'success'): void {
    this.message.set(message);
    this.type.set(type);

    window.setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear(): void {
    this.message.set('');
    this.type.set('');
  }
}