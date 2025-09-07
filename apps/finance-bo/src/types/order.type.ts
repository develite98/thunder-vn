import { EReason } from './receipt.type';

export enum EOrderStatus {
  NEW = 'New',
  WAITING_FOR_PAYMENT = 'WaitingForPayment',
  CANCELED = 'Cancelled',
  ORDER = 'Order',
  PAID = 'Paid',
  SHIPPING = 'Shipping',
  SUCCESS = 'Success',
  PAYMENT_SUCCESS = 'PaymentSuccess',
  PAYMENT_FAILED = 'PaymentFailed',
  SHIPPING_FAILED = 'ShippingFailed',
  PRINT_CHECK = 'PrintCheck',
}

export enum ESaleType {
  DineIn = 'DineIn',
  Delivery = 'Delivery',
  TakeAway = 'TakeAway',
}
export enum ECancellationType {
  Order = 'Order',
  OrderItem = 'OrderItem',
  Addon = 'Addon',
  Receipt = 'Receipt',
}

export interface IOrder {
  id?: string;
  customerId?: number;
  branchId?: number;
  shiftId?: number;
  tableId?: number;
  checkNo?: string;
  checkNoCode?: string;
  isDeleted?: boolean;
  title?: string;
  posDeviceId?: number;
  nationalities?: string[];
  paymentRequest?: string;
  notes?: string;
  paymentResponse?: unknown;
  paymentGateway?: string;
  paymentStatus?: string;
  orderStatus?: EOrderStatus;
  totalValue?: number;
  totalGrossValue?: number;
  discounts?: {
    title: string;
    actualDiscountValue: number;
    quantity: number;
    currency: string;
  }[];
  payment: { details: { paymentMethod: string; value: number }[] };
  totalTaxValue?: number;
  paymentDeviceId?: number;
  finalTotalValue?: number;
  finalTotalGrossValue?: number;
  finalTotalTaxValue?: number;
  finalTotalFeeValue?: number;
  isPendingCancellation?: number;
  currency?: string;
  orderItems?: IOrderItem[];
  items?: IOrderItem[];
  totalGuest?: number;
  createdDateTime?: string;
  createdBy?: string;
  orderNo?: number;
  orderTurnNo?: number;
  paymentId?: string;
  saleType?: ESaleType;
  saleDate?: string;
  saleChannelId?: number;
  isFrozen?: boolean;
  endTime?: Date;
}

export interface IOrderItem {
  id: string;
  title: string;
  description: string;
  price?: number;
  quantity?: number;
  currency?: string;
  notes?: string[];
  type?: 'default' | 'half&half' | 'Attribute';
  items?: IOrderItemData[];
  totalValue?: number;
  priority?: number;
  orderTurnNo?: number;
  createdDateTime?: Date;
  orderId: string;
  cancellationStatus?: 'Approved' | null;
  createdBy?: string;
}

export interface IOrderItemData {
  id?: string;
  orderItemDataId?: string;
  orderItemId?: string;
  menuItemId?: number;
  title?: string;
  price?: number;
  currency?: string;
  taxInPercent?: number;
  quantity?: number;
  type?: string;
  notes?: string[];
  items?: IOrderItemData[];
  orderItem?: IOrderItem;
  menuItemCode?: string;
  orderId: string;
  priority?: number;
  createdBy?: string;
  totalGrossValue?: number;
  pricingRounding: number;
  saleChannelId: number;
  printerAreaIds: number[];
}

export interface CancelReceiptPayload {
  branchId: number;
  originStoreId?: number;
  orderId: string;
  cancellationReason?: EReason;
  reason?: EReason;
  itemType: ECancellationType;
  cancellationType?: ECancellationType;
  tableId?: number;
  shiftId?: number;
  itemId?: string;
  name?: string;
  requestedBy?: string;
  quantity?: number;
  notificationId?: number;
  deviceId?: number;
}
