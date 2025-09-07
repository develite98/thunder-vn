export interface IOrder {
  id: number;
  ward: string;
  email: string;
  phone_number: string;
  customer_name: string;
  agency_id: number;
  order_status: OrderStatus;
  created_by: string;
  address: string;
  created_date: string;
  updated_date: string;
  city: string;
  district: string;
  order_items: IOrderItems;
  created_at: string;
  total_value: number;
}

export enum OrderStatus {
  New = 'new',
  Processing = 'processing',
  Paymented = 'paymented',
  Shipping = 'shipping',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export interface IOrderItems {
  data: IOrderItemData[];
}

export interface IOrderItemData {
  id: string;
  quantity: number;
  productId: number;
  thumbnail: string;
  title: string;
  price: number;
  systemNote: string;
  customerNote: string;
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.New]: 'Đang xử lý',
  [OrderStatus.Processing]: 'Đang xử lý',
  [OrderStatus.Paymented]: 'Đã thanh toán',
  [OrderStatus.Shipping]: 'Đang giao hàng',
  [OrderStatus.Completed]: 'Hoàn thành',
  [OrderStatus.Cancelled]: 'Đã hủy',
};

export class OrderHelper {
  public static calculateTotalPrice(order: IOrder): number {
    return order.order_items?.data?.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  public static getOrderStatusLabel(status: OrderStatus): string {
    return OrderStatusLabels[status] || 'Mới';
  }
}
