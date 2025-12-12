export interface Shipment {
  id: string;
  recipientName: string;
  address: string;
  phone: string;
  itemType: string;
  trackNumber: string;
  invoiceNumber?: string;
  numberOfItems: number;
  numberOfPlaces: number;
  totalWeight: number;
  usdRatePerKg: number;
  deliveryPrice: number;
  packingPrice: number;
  goodsCost: number;
  insuranceCost: number;
  moscowDelivery: number;
  compensationAmount: number;
  totalAmount: number;
  giveToChineseNotes: string;
}

export type ShipmentStatus = "Sent" | "Processing" | "Shipped" | "Delivered" | "Returned";

export interface Shipment {
  id: string;
  recipientName: string;
  address: string;
  phone: string;
  itemType: string;
  trackNumber: string;
  invoiceNumber?: string;
  numberOfItems: number;
  numberOfPlaces: number;
  totalWeight: number;
  usdRatePerKg: number;
  deliveryPrice: number;
  packingPrice: number;
  goodsCost: number;
  insuranceCost: number;
  moscowDelivery: number;
  compensationAmount: number;
  totalAmount: number;
  giveToChineseNotes: string;
  status: ShipmentStatus;
}