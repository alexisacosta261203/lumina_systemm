import { Component, computed, inject } from '@angular/core';
import { UiNotificationsService } from '../../../core/services/ui-notifications';

@Component({
  selector: 'app-app-toast',
  imports: [],
  templateUrl: './app-toast.html',
  styleUrl: './app-toast.scss',
})
export class AppToast {
  private readonly uiNotificationsService = inject(UiNotificationsService);

  readonly message = this.uiNotificationsService.message;
  readonly type = this.uiNotificationsService.type;
  readonly visible = computed(() => !!this.message());

  close(): void {
    this.uiNotificationsService.clear();
  }
}