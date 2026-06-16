export interface ResumenResponse {
  ventas_hoy: number;
  ticket_promedio: number;
  pedidos_activos: number;
  mes_actual: number;
}

export interface VentasPeriodoItem {
  fecha_grupo: string;
  cantidad_pedidos: number;
  ventas_totales: number;
}

export interface ProductoTopItem {
  nombre: string;
  total_ingresos: number;
  cantidad_vendida: number;
}

export interface PedidosEstadoItem {
  estado_codigo: string;
  cantidad: number;
}

export interface IngresosResponse {
  forma_pago_codigo: string;
  cantidad: number;
}
