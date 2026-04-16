export interface Course {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  precio: number;
  categoria: string;
  duracionHoras: number;
  nivel: string;
  activo: boolean;
}