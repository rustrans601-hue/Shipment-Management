import React from "react";
import { 
  Input, 
  Button, 
  Textarea, 
  Divider,
  ModalFooter,
  Select,
  SelectItem
} from "@heroui/react";
import { Shipment, ShipmentStatus } from "../types/shipment";
import { Icon } from "@iconify/react";
import { Recipient } from "../types/shipment";

interface ShipmentFormProps {
  initialData: Shipment | null;
  onSubmit: (data: Shipment) => void;
  onCancel: () => void;
}

export const ShipmentForm: React.FC<ShipmentFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel
}) => {
  // Fix the issue with the invoice number not displaying in edit mode
  const [formData, setFormData] = React.useState<Shipment>(() => {
    if (initialData) {
      // Create a deep copy of initialData and ensure invoiceNumber is preserved
      const data = JSON.parse(JSON.stringify(initialData));
      console.log("Initial data in form:", data); // Debug log
      return data;
    }
    
    return {
      id: crypto.randomUUID(),
      recipientName: "",
      address: "",
      phone: "",
      invoiceNumber: `F-${Math.floor(1000 + Math.random() * 9000)}-1`,
      itemType: "",
      trackNumber: `TR${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      numberOfItems: 1,
      numberOfPlaces: 1,
      totalWeight: 0,
      usdRatePerKg: 10,
      deliveryPrice: 0,
      packingPrice: 0,
      goodsCost: 0,
      insuranceCost: 0,
      moscowDelivery: 0,
      compensationAmount: 0,
      totalAmount: 0,
      giveToChineseNotes: "",
      status: "Sent" // Default status for new shipments
    };
  });
  
  // Remove isAddingRecipient effect
  // ... delete isAddingRecipient effect ...
  
  // Calculate total amount when relevant fields change
  React.useEffect(() => {
    const total = 
      formData.deliveryPrice + 
      formData.packingPrice + 
      formData.goodsCost + 
      formData.insuranceCost + 
      formData.moscowDelivery;
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total
    }));
  }, [
    formData.deliveryPrice,
    formData.packingPrice,
    formData.goodsCost,
    formData.insuranceCost,
    formData.moscowDelivery
  ]);
  
  const handleChange = (field: keyof Shipment, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fix: Ensure we're passing the complete formData object
    onSubmit({...formData});
  };
  
  // Status options with translations
  const statusOptions: {key: ShipmentStatus, label: string, translation: string}[] = [
    { key: "Sent", label: "Отправлено", translation: "已发送" },
    { key: "Processing", label: "В обработке", translation: "处理中" },
    { key: "Shipped", label: "Доставляется", translation: "运输中" },
    { key: "Delivered", label: "Доставлено", translation: "已送达" },
    { key: "Returned", label: "Возвращено", translation: "已退回" }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Накладная"
        placeholder="Номер накладной"
        value={formData.invoiceNumber}
        onValueChange={(value) => handleChange("invoiceNumber", value)}
        isRequired
      />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Информация о получателе</h3>
        
        <Input
          label="Имя Получателя"
          placeholder="Полное имя"
          value={formData.recipientName}
          onValueChange={(value) => handleChange("recipientName", value)}
          isRequired
        />
        
        <Textarea
          label="Адрес"
          placeholder="Полный адрес"
          value={formData.address}
          onValueChange={(value) => handleChange("address", value)}
        />
        
        <Input
          label="Телефон"
          placeholder="Контактный телефон"
          value={formData.phone}
          onValueChange={(value) => handleChange("phone", value)}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Трек-Номер по Китаю"
          placeholder="Номер отслеживания"
          value={formData.trackNumber}
          onValueChange={(value) => handleChange("trackNumber", value)}
          isRequired
        />
        
        <Select
          label="Статус"
          placeholder="Выберите статус"
          selectedKeys={formData.status ? [formData.status] : ["Sent"]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as ShipmentStatus;
            if (selected) {
              handleChange("status", selected);
            }
          }}
          defaultSelectedKeys={["Sent"]}
        >
          {statusOptions.map((status) => (
            <SelectItem key={status.key} value={status.key}>
              {status.label} ({status.translation})
            </SelectItem>
          ))}
        </Select>
      </div>
      
      <Divider className="my-4" />
      
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          type="number"
          label="Кол-во товара"
          placeholder="0"
          value={formData.numberOfItems.toString()}
          onValueChange={(value) => handleChange("numberOfItems", parseInt(value) || 0)}
          min={1}
        />
        
        <Input
          type="number"
          label="Кол-во мест"
          placeholder="0"
          value={formData.numberOfPlaces.toString()}
          onValueChange={(value) => handleChange("numberOfPlaces", parseInt(value) || 0)}
          min={1}
        />
        
        <Input
          type="number"
          label="Общ вес товара (кг)"
          placeholder="0.00"
          value={formData.totalWeight.toString()}
          onValueChange={(value) => handleChange("totalWeight", parseFloat(value) || 0)}
          step="0.01"
          min={0}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          type="number"
          label="Ставка долл за кг"
          placeholder="0.00"
          value={formData.usdRatePerKg.toString()}
          onValueChange={(value) => handleChange("usdRatePerKg", parseFloat(value) || 0)}
          startContent={<div className="pointer-events-none">$</div>}
          step="0.01"
          min={0}
        />
        
        <Input
          type="number"
          label="Цена за доставку"
          placeholder="0.00"
          value={formData.deliveryPrice.toString()}
          onValueChange={(value) => handleChange("deliveryPrice", parseFloat(value) || 0)}
          startContent={<div className="pointer-events-none">$</div>}
          step="0.01"
          min={0}
        />
        
        <Input
          type="number"
          label="Цена за упаковку"
          placeholder="0.00"
          value={formData.packingPrice.toString()}
          onValueChange={(value) => handleChange("packingPrice", parseFloat(value) || 0)}
          startContent={<div className="pointer-events-none">$</div>}
          step="0.01"
          min={0}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          type="number"
          label="Стоимость товара"
          placeholder="0.00"
          value={formData.goodsCost.toString()}
          onValueChange={(value) => handleChange("goodsCost", parseFloat(value) || 0)}
          startContent={<div className="pointer-events-none">$</div>}
          step="0.01"
          min={0}
        />
        
        <Input
          type="number"
          label="Стоимость страховки"
          placeholder="0.00"
          value={formData.insuranceCost.toString()}
          onValueChange={(value) => handleChange("insuranceCost", parseFloat(value) || 0)}
          startContent={<div className="pointer-events-none">$</div>}
          step="0.01"
          min={0}
        />
        
        <Input
          type="number"
          label="Доставка по Москве"
          placeholder="0.00"
          value={formData.moscowDelivery.toString()}
          onValueChange={(value) => handleChange("moscowDelivery", parseFloat(value) || 0)}
          startContent={<div className="pointer-events-none">$</div>}
          step="0.01"
          min={0}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="number"
          label="Сумма компенсации"
          placeholder="0.00"
          value={formData.compensationAmount.toString()}
          onValueChange={(value) => handleChange("compensationAmount", parseFloat(value) || 0)}
          startContent={<div className="pointer-events-none">$</div>}
          step="0.01"
          min={0}
        />
        
        <Input
          type="number"
          label="Общая сумма оплаты"
          placeholder="0.00"
          value={formData.totalAmount.toFixed(2)}
          isReadOnly
          startContent={<div className="pointer-events-none">$</div>}
          classNames={{
            input: "font-semibold text-primary",
          }}
        />
      </div>
      
      <Textarea
        label="Дать Китайцам"
        placeholder="Специальные инструкции или заметки"
        value={formData.giveToChineseNotes}
        onValueChange={(value) => handleChange("giveToChineseNotes", value)}
      />
      
      <ModalFooter>
        <Button color="danger" variant="flat" onPress={onCancel}>
          Отмена
        </Button>
        <Button color="primary" type="submit">
          {initialData ? "Обновить" : "Создать"}
        </Button>
      </ModalFooter>
    </form>
  );
};