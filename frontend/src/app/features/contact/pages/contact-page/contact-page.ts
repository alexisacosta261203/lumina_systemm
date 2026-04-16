import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService } from '../../../../core/services/contact';
import { Contact } from '../../../../shared/interfaces/contact.interface';
import { UiNotificationsService } from '../../../../core/services/ui-notifications';

@Component({
  selector: 'app-contact-page',
  imports: [FormsModule],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage {
  private readonly contactService = inject(ContactService);
  private readonly uiNotificationsService = inject(UiNotificationsService);

  contactData: Contact = {
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: '',
  };

  formSubmitted = false;
  sendSuccess = false;
  responseMessage = '';

  submitContactForm(form: NgForm): void {
    this.formSubmitted = true;

    if (form.invalid) {
      this.sendSuccess = false;
      this.responseMessage = 'Corrige los campos marcados antes de enviar.';
      this.uiNotificationsService.show(this.responseMessage, 'error');
      return;
    }

    this.contactService.sendMessage(this.contactData).subscribe((response) => {
      this.sendSuccess = response.ok;
      this.responseMessage = response.message;
      this.uiNotificationsService.show(
  response.message,
  response.ok ? 'success' : 'error'
);

      if (response.ok) {
        form.resetForm();
        this.formSubmitted = false;
        this.contactData = {
          nombre: '',
          correo: '',
          asunto: '',
          mensaje: '',
        };
      }
    });
  }
}