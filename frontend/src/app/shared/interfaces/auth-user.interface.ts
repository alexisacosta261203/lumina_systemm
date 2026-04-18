export interface AuthUser {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  role: 'user' | 'admin';
  activo?: number;
  createdAt?: string;
}