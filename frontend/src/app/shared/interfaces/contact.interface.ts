export interface Contact {
  id?: number;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  fechaEnvio?: string;
}