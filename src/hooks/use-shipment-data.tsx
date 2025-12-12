import React from "react";
import { Shipment, ShipmentStatus } from "../types/shipment";
import Papa from 'papaparse';

// Revert sample data to original structure
const additionalShipments: Shipment[] = Array.from({ length: 40 }, (_, index) => ({
  id: `${6 + index}`,
  recipientName: `Получатель ${6 + index}`,
  address: `ул. Примерная ${100 + index}, Город`,
  phone: `+7 (999) ${100 + index}-${1000 + index}`,
  itemType: ["Электроника", "Одежда", "Книги", "Подарки", "Инструменты"][index % 5],
  trackNumber: `TR${(1000000 + index).toString().padStart(6, '0')}`,
  invoiceNumber: `F-${9000 + index}-1`,
  numberOfItems: Math.floor(Math.random() * 10) + 1,
  numberOfPlaces: Math.floor(Math.random() * 3) + 1,
  totalWeight: +(Math.random() * 10 + 1).toFixed(2),
  usdRatePerKg: +(Math.random() * 5 + 8).toFixed(2),
  deliveryPrice: +(Math.random() * 100 + 20).toFixed(2),
  packingPrice: +(Math.random() * 20 + 5).toFixed(2),
  goodsCost: +(Math.random() * 500 + 50).toFixed(2),
  insuranceCost: +(Math.random() * 30 + 5).toFixed(2),
  moscowDelivery: +(Math.random() * 40).toFixed(2),
  compensationAmount: 0,
  totalAmount: 0, // Will be calculated
  giveToChineseNotes: ["Хрупкое", "Срочно", "Подарок", "Осторожно", ""][index % 5],
  status: ["Sent", "Processing", "Shipped", "Delivered", "Returned"][index % 5] as ShipmentStatus
}));

// Calculate total amount for each shipment
additionalShipments.forEach(shipment => {
  shipment.totalAmount = +(
    shipment.deliveryPrice +
    shipment.packingPrice +
    shipment.goodsCost +
    shipment.insuranceCost +
    shipment.moscowDelivery
  ).toFixed(2);
});

const initialShipments: Shipment[] = [
  {
    id: "1",
    recipientName: "Иван Петров",
    address: "ул. Ленина 123, Москва",
    phone: "+7 (999) 123-4567",
    itemType: "Электроника",
    trackNumber: "TR123456",
    invoiceNumber: "F-9876-1",
    numberOfItems: 2,
    numberOfPlaces: 1,
    totalWeight: 5.2,
    usdRatePerKg: 12,
    deliveryPrice: 62.4,
    packingPrice: 10,
    goodsCost: 350,
    insuranceCost: 15,
    moscowDelivery: 25,
    compensationAmount: 0,
    totalAmount: 462.4,
    giveToChineseNotes: "Хрупкое",
    status: "Sent"
  },
  {
    id: "2",
    recipientName: "Мария Сидорова",
    address: "ул. Пушкина 45, Санкт-Петербург",
    phone: "+7 (888) 765-4321",
    itemType: "Одежда",
    trackNumber: "TR654321",
    invoiceNumber: "F-9875-1",
    numberOfItems: 5,
    numberOfPlaces: 1,
    totalWeight: 3.1,
    usdRatePerKg: 10,
    deliveryPrice: 31,
    packingPrice: 5,
    goodsCost: 120,
    insuranceCost: 10,
    moscowDelivery: 0,
    compensationAmount: 0,
    totalAmount: 166,
    giveToChineseNotes: "",
    status: "Shipped"
  },
  {
    id: "3",
    recipientName: "Дмитрий Петров",
    address: "ул. Ленина 789, Москва",
    phone: "+7 (999) 123-4567",
    itemType: "Книги",
    trackNumber: "TR345678",
    invoiceNumber: "F-9874-1",
    numberOfItems: 10,
    numberOfPlaces: 1,
    totalWeight: 8.5,
    usdRatePerKg: 8,
    deliveryPrice: 68,
    packingPrice: 12,
    goodsCost: 120,
    insuranceCost: 5,
    moscowDelivery: 15,
    compensationAmount: 0,
    totalAmount: 220,
    giveToChineseNotes: "Образовательные материалы",
    status: "Sent"
  },
  {
    id: "4",
    recipientName: "Виолетта Кузнецова",
    address: "ул. Пушкина 101, Москва",
    phone: "+7 (999) 123-4567",
    itemType: "Подарки",
    trackNumber: "TR901234",
    invoiceNumber: "F-9873-1",
    numberOfItems: 3,
    numberOfPlaces: 3,
    totalWeight: 4.2,
    usdRatePerKg: 11,
    deliveryPrice: 46.2,
    packingPrice: 15,
    goodsCost: 200,
    insuranceCost: 10,
    moscowDelivery: 30,
    compensationAmount: 0,
    totalAmount: 301.2,
    giveToChineseNotes: "Дары, доставить до 15 июня",
    status: "Shipped"
  },
  {
    id: "5",
    recipientName: "София Мартин",
    address: "ул. Ленина 202, Москва",
    phone: "+7 (999) 123-4567",
    itemType: "Инструменты для рисования",
    trackNumber: "TR567890",
    invoiceNumber: "F-9872-1",
    numberOfItems: 8,
    numberOfPlaces: 2,
    totalWeight: 6.7,
    usdRatePerKg: 14,
    deliveryPrice: 93.8,
    packingPrice: 20,
    goodsCost: 450,
    insuranceCost: 25,
    moscowDelivery: 35,
    compensationAmount: 0,
    totalAmount: 623.8,
    giveToChineseNotes: "Сложные предметы",
    status: "Sent"
  },
  ...additionalShipments
];

export const useShipmentData = () => {
  // Add a console.log to check initialShipments
  console.log("Initial shipments:", initialShipments.length);
  
  const [shipments, setShipments] = React.useState<Shipment[]>(() => {
    const savedShipments = localStorage.getItem("shipments");
    return savedShipments ? JSON.parse(savedShipments) : initialShipments;
  });
  
  // Add another console.log to check loaded shipments
  React.useEffect(() => {
    console.log("Loaded shipments:", shipments.length);
  }, [shipments]);
  
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Simulate loading data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Save to localStorage whenever shipments change
  React.useEffect(() => {
    localStorage.setItem("shipments", JSON.stringify(shipments));
  }, [shipments]);
  
  const addShipment = (shipment: Shipment) => {
    // Ensure new shipments have a status (default to "Sent" if not provided)
    const newShipment = {
      ...shipment,
      id: crypto.randomUUID(),
      status: shipment.status || "Sent"
    };
    setShipments(prev => [...prev, newShipment]);
  };
  
  const updateShipment = (id: string, updatedShipment: Shipment) => {
    setShipments(prev => 
      prev.map(shipment => 
        shipment.id === id ? { ...updatedShipment, id } : shipment
      )
    );
  };
  
  const deleteShipment = (id: string) => {
    setShipments(prev => prev.filter(shipment => shipment.id !== id));
  };
  
  const exportDatabase = () => {
    const csv = Papa.unparse(shipments);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'shipments_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const importFromCSV = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        const importedShipments = results.data.map((row: any) => ({
          id: crypto.randomUUID(),
          recipientName: row.recipientName || '',
          address: row.address || '',
          phone: row.phone || '',
          itemType: row.itemType || '',
          trackNumber: row.trackNumber || '',
          invoiceNumber: row.invoiceNumber || '',
          numberOfItems: parseInt(row.numberOfItems) || 0,
          numberOfPlaces: parseInt(row.numberOfPlaces) || 0,
          totalWeight: parseFloat(row.totalWeight) || 0,
          usdRatePerKg: parseFloat(row.usdRatePerKg) || 0,
          deliveryPrice: parseFloat(row.deliveryPrice) || 0,
          packingPrice: parseFloat(row.packingPrice) || 0,
          goodsCost: parseFloat(row.goodsCost) || 0,
          insuranceCost: parseFloat(row.insuranceCost) || 0,
          moscowDelivery: parseFloat(row.moscowDelivery) || 0,
          compensationAmount: parseFloat(row.compensationAmount) || 0,
          totalAmount: parseFloat(row.totalAmount) || 0,
          giveToChineseNotes: row.giveToChineseNotes || '',
          status: (row.status as ShipmentStatus) || 'Sent'
        }));
        setShipments(importedShipments);
      },
      header: true,
      skipEmptyLines: true
    });
  };
  
  return {
    shipments,
    addShipment,
    updateShipment,
    deleteShipment,
    isLoading,
    exportDatabase,
    importFromCSV
  };
};