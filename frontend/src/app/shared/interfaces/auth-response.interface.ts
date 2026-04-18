import { AuthUser } from './auth-user.interface';

export interface AuthResponse {
  ok: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
  id?: number;
  data?: AuthUser;
}