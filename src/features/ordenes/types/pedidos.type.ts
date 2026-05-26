export type EstadoPedido =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_PREPARACION"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

export type FormaPago =
  | "MERCADOPAGO"
  | "EFECTIVO"
  | "TRANSFERENCIA";



export interface IUsuarioPedido {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
}



export interface IDireccionPedido {
  linea1: string;
  linea2?: string;

  ciudad: string;
  provincia: string;
}



export interface IDetallePedidoCreate {
  producto_id: number;
  cantidad: number;
  personalizacion: number[];
}

export interface IDetallePedido {
  pedido_id: number;
  producto_id: number;

  cantidad: number;

  nombre_snapshot: string;
  precio_snapshot: number;
  subtotal_snap: number;

  personalizacion: number[];

  created_at: string;
}



export interface IHistorialEstadoPedido {
  id: number;

  pedido_id: number;

  estado_desde?: EstadoPedido;
  estado_hasta: EstadoPedido;

  usuario_id?: number;

  motivo?: string;

  created_at: string;
}



export interface IPedidoCreate {
  direccion_id?: number;

  forma_pago_codigo: FormaPago;

  descuento: number;
  costo_envio: number;

  notas?: string;

  detalle_pedidos: IDetallePedidoCreate[];
}

export interface IPedido {
  id: number;

  usuario_id: number;

  direccion_id?: number;

  estado_codigo: EstadoPedido;

  forma_pago_codigo: FormaPago;

  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;

  notas?: string;

  activo: boolean;

  usuario: IUsuarioPedido;

  direccion?: IDireccionPedido;

  detalle_pedidos: IDetallePedido[];

  historial_estado: IHistorialEstadoPedido[];

  created_at: string;
  updated_at: string;
}



export interface PedidoHistorialUpdate {
  estado_bool: boolean;
  motivo?: string;
}



export interface KanbanColumnProps {
  title: string;

  estado: EstadoPedido;

  pedidos: IPedido[];
}

export interface PedidoCardProps {
  pedido: IPedido;

  onView: (pedido: IPedido) => void;

  onAdvance: (pedido: IPedido) => void;

  onCancel: (pedido: IPedido) => void;
}

export interface PedidoDetailModalProps {
  pedido: IPedido | null;

  open: boolean;

  onClose: () => void;
}