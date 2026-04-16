export interface Purchase {
  id?: number;
  cursoId: number;
  nombreCliente: string;
  correoCliente: string;
  telefono: string;
  metodoPago: string;
  comprobanteUrl?: string;
  fechaCompra?: string;
}