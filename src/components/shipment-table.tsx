import React from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button,
  Input,
  Tooltip,
  Pagination,
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  Link
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useShipmentData } from "../hooks/use-shipment-data";
import { ShipmentForm } from "./shipment-form";
import { Shipment } from "../types/shipment";
import { ShipmentStatus } from "../types/shipment";

export const ShipmentTable: React.FC = () => {
  const { 
    shipments, 
    addShipment, 
    updateShipment, 
    deleteShipment,
    isLoading,
    exportDatabase,
    importFromCSV
  } = useShipmentData();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const { 
    isOpen, onOpen, onOpenChange, onClose 
  } = useDisclosure();
  const [currentShipment, setCurrentShipment] = React.useState<Shipment | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  
  const { 
    isOpen: isMergeModalOpen, 
    onOpen: onMergeModalOpen, 
    onOpenChange: onMergeModalOpenChange,
    onClose: onMergeModalClose
  } = useDisclosure();
  const [newWaybillNumber, setNewWaybillNumber] = React.useState("");
  
  // Add state for selected shipments
  const [selectedShipments, setSelectedShipments] = React.useState<Set<string>>(new Set());
  
  // Modify filteredShipments to include all matching shipments
  const filteredShipments = React.useMemo(() => {
    return shipments.filter(shipment => 
      shipment.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [shipments, searchQuery]);
  
  // Modify items to show all filtered shipments
  const items = filteredShipments;
  
  // Add status color mapping function
  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case "Shipped":
        return "bg-[#98FB98]"; // Light green for shipped status
      case "Delivered":
        return "bg-blue-100";
      case "Returned":
        return "bg-red-100";
      case "Processing":
        return "bg-yellow-100";
      default:
        return "";
    }
  };
  
  // Add status label mapping function
  const getStatusLabel = (status: ShipmentStatus) => {
    switch (status) {
      case "Sent":
        return { label: "Отправлено", translation: "已发送" };
      case "Processing":
        return { label: "В обработке", translation: "处理中" };
      case "Shipped":
        return { label: "Доставляется", translation: "运输中" };
      case "Delivered":
        return { label: "Доставлено", translation: "已送达" };
      case "Returned":
        return { label: "Возвращено", translation: "已退回" };
      default:
        return { label: "Отправлено", translation: "已发送" };
    }
  };
  
  // Add status update handler
  const handleStatusChange = (shipmentId: string, newStatus: ShipmentStatus) => {
    updateShipment(shipmentId, { 
      ...shipments.find(s => s.id === shipmentId)!,
      status: newStatus 
    });
  };
  
  const handleAdd = () => {
    setCurrentShipment(null);
    setIsEditing(false);
    onOpen();
  };
  
  const handleEdit = (shipment: Shipment) => {
    // Create a complete copy to avoid direct mutation
    const shipmentCopy = {
      ...shipment,
      // Ensure invoiceNumber exists, use a default if it doesn't
      invoiceNumber: shipment.invoiceNumber || `F-${Math.floor(1000 + Math.random() * 9000)}-${shipment.id}`
    };
    
    console.log("Editing shipment:", shipmentCopy); // Debug log
    setCurrentShipment(shipmentCopy);
    setIsEditing(true);
    onOpen();
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this shipment?")) {
      deleteShipment(id);
    }
  };
  
  const handleSubmit = (shipment: Shipment) => {
    if (isEditing && currentShipment) {
      updateShipment(currentShipment.id, shipment);
    } else {
      addShipment(shipment);
    }
    onClose();
  };
  
  // Handle row selection
  const handleRowSelectionChange = (shipmentId: string) => {
    setSelectedShipments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shipmentId)) {
        newSet.delete(shipmentId);
      } else {
        newSet.add(shipmentId);
      }
      return newSet;
    });
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedShipments.size === items.length) {
      // If all are selected, clear selection
      setSelectedShipments(new Set());
    } else {
      // Otherwise select all visible items
      const newSelected = new Set<string>();
      items.forEach(shipment => newSelected.add(shipment.id));
      setSelectedShipments(newSelected);
    }
  };
  
  // Handle print barcode labels
  const handlePrintBarcodes = () => {
    if (selectedShipments.size === 0) {
      alert("Пожалуйста, выберите хотя бы одно отправление для печати штрих-кода");
      return;
    }
    
    // Get selected shipments data
    const shipmentsToPrint = shipments.filter(s => selectedShipments.has(s.id));
    
    // Open print preview in new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Пожалуйста, разрешите всплывающие окна для этого сайта");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Штрих-коды отправлений</title>
          <style>
            @page { 
              size: 100mm 150mm; 
              margin: 5mm;
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 0;
            }
            .label-container { 
              width: 90mm;
              height: 140mm;
              border: 1px solid #000;
              margin-bottom: 10mm;
              page-break-after: always;
              padding: 5mm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
            }
            .label-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10mm;
              border-bottom: 2px solid #000;
              padding-bottom: 5mm;
            }
            .invoice-number {
              font-size: 24px;
              font-weight: bold;
            }
            .rtc-logo {
              font-size: 24px;
              font-weight: bold;
            }
            .barcode-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              flex-grow: 1;
              justify-content: center;
            }
            .barcode { 
              height: 80px;
              margin: 10mm 0;
            }
            .track-number {
              font-family: monospace;
              font-size: 16px;
              margin-top: 5mm;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${shipmentsToPrint.map(shipment => {
            // Use the full invoice number instead of just the F-XXXX part
            const invoiceNumber = shipment.invoiceNumber || 
                                   `F-${Math.floor(1000 + Math.random() * 9000)}-${shipment.id}`;
            
            return `
              <div class="label-container">
                <div class="label-header">
                  <div class="invoice-number">${invoiceNumber}</div>
                  <div class="rtc-logo">RTC</div>
                </div>
                
                <div class="barcode-container">
                  <svg class="barcode" 
                    jsbarcode-format="code128"
                    jsbarcode-value="${shipment.trackNumber}"
                    jsbarcode-textmargin="0"
                    jsbarcode-fontoptions="bold">
                  </svg>
                  <div class="track-number">${shipment.trackNumber}</div>
                </div>
              </div>
            `;
          }).join('')}
          
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            JsBarcode(".barcode").init();
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  const handleExport = () => {
    exportDatabase();
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importFromCSV(file);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by recipient or tracking number..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" className="h-4 w-4 text-default-400" />}
            className="max-w-md"
          />
          <div className="flex gap-2 flex-wrap">
            <Button 
              color="secondary" 
              onPress={handlePrintBarcodes}
              startContent={<Icon icon="lucide:printer" className="h-4 w-4" />}
              isDisabled={selectedShipments.size === 0}
            >
              Печать штрих-кодов ({selectedShipments.size})
            </Button>
            <Button 
              color="primary" 
              onPress={handleAdd}
              startContent={<Icon icon="lucide:plus" className="h-4 w-4" />}
            >
              Add Shipment
            </Button>
            <Button
              color="success"
              onPress={handleExport}
              startContent={<Icon icon="lucide:download" className="h-4 w-4" />}
            >
              Export Database
            </Button>
            <label htmlFor="csv-upload">
              <Button
                as="span"
                color="warning"
                startContent={<Icon icon="lucide:upload" className="h-4 w-4" />}
              >
                Import from CSV
              </Button>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
            <Link
              href="/import-template.csv"
              download
              className="text-primary hover:underline flex items-center"
            >
              <Icon icon="lucide:file-text" className="h-4 w-4 mr-1" />
              Download Import Template
            </Link>
          </div>
        </div>
        
        <Table 
          aria-label="Shipment tracking table"
          removeWrapper
          isHeaderSticky
          classNames={{
            base: "max-h-[70vh] overflow-auto", // Increased max height to 70% of viewport
            table: "border-collapse border border-divider",
            th: "bg-content2 border-b border-r border-divider px-4 py-3 text-xs font-semibold sticky top-0 z-10",
            td: "border-b border-r border-divider px-4 py-3",
            tr: "hover:bg-content2/40 transition-colors",
          }}
        >
          <TableHeader>
            <TableColumn>
              <div className="flex items-center">
                <Checkbox
                  isSelected={selectedShipments.size === items.length && items.length > 0}
                  isIndeterminate={selectedShipments.size > 0 && selectedShipments.size < items.length}
                  onValueChange={handleSelectAll}
                  aria-label="Select all shipments"
                />
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>№</span>
                <span className="text-xs text-default-500">序号</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>НАКЛАДНАЯ</span>
                <span className="text-xs text-default-500">发票</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ИМЯ ПОЛУЧАТЕЛЯ</span>
                <span className="text-xs text-default-500">收件人姓名</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>АДРЕС/ТЕЛЕФОН</span>
                <span className="text-xs text-default-500">地址/电话</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ТИП ТОВАРА</span>
                <span className="text-xs text-default-500">商品类型</span>
              </div>
            </TableColumn>
            
            {/* New Status Column */}
            <TableColumn>
              <div className="flex flex-col">
                <span>СТАТУС</span>
                <span className="text-xs text-default-500">状态</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ТРЕК-НОМЕР ПО КИТАЮ</span>
                <span className="text-xs text-default-500">中国跟踪号码</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>КОЛ-ВО ТОВАРА</span>
                <span className="text-xs text-default-500">商品数量</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>КОЛ-ВО МЕСТ</span>
                <span className="text-xs text-default-500">包裹数量</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ОБЩ ВЕС ТОВАРА</span>
                <span className="text-xs text-default-500">总重量</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>СТАВКА ДОЛЛ ЗА КГ</span>
                <span className="text-xs text-default-500">美元/公斤</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ЦЕНА ЗА ДОСТАВКУ</span>
                <span className="text-xs text-default-500">运费</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ЦЕНА ЗА УПАКОВКУ</span>
                <span className="text-xs text-default-500">包装费</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>СТОИМОСТЬ ТОВАРА</span>
                <span className="text-xs text-default-500">商品价值</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>СТОИМОСТЬ СТРАХОВКИ</span>
                <span className="text-xs text-default-500">保险费</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ДОСТАВКА ПО МОСКВЕ</span>
                <span className="text-xs text-default-500">莫斯科配送</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>СУММА КОМПЕНСАЦИИ</span>
                <span className="text-xs text-default-500">赔偿金额</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ОБЩАЯ СУММА ОПЛАТЫ</span>
                <span className="text-xs text-default-500">总付款金额</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ДАТЬ КИТАЙЦАМ</span>
                <span className="text-xs text-default-500">给中方的备注</span>
              </div>
            </TableColumn>
            
            <TableColumn>
              <div className="flex flex-col">
                <span>ДЕЙСТВИЯ</span>
                <span className="text-xs text-default-500">操作</span>
              </div>
            </TableColumn>
          </TableHeader>
          
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={21} className="text-center">
                  <div className="flex justify-center items-center h-12">
                    <Icon icon="lucide:loader" className="animate-spin h-6 w-6" />
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={21} className="text-center">
                  <p className="text-sm text-default-400">No shipments found</p>
                </TableCell>
              </TableRow>
            ) : (
              items.map((shipment, index) => {
                const statusInfo = getStatusLabel(shipment.status || "Sent");
                const statusColor = getStatusColor(shipment.status || "Sent");
                
                return (
                  <TableRow 
                    key={shipment.id}
                    className={`${selectedShipments.has(shipment.id) ? "bg-primary/10" : ""} ${statusColor}`}
                  >
                    <TableCell>
                      <Checkbox
                        isSelected={selectedShipments.has(shipment.id)}
                        onValueChange={() => handleRowSelectionChange(shipment.id)}
                        aria-label={`Select shipment ${shipment.recipientName}`}
                      />
                    </TableCell>
                    
                    <TableCell>{index + 1}</TableCell>
                    
                    <TableCell>
                      <span className="font-mono text-sm font-semibold">{shipment.invoiceNumber || `F-${Math.floor(1000 + Math.random() * 9000)}-${index + 1}`}</span>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <p className="font-medium">{shipment.recipientName}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <p className="text-xs">{shipment.address}</p>
                        <p className="text-xs font-medium">{shipment.phone}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>{shipment.itemType}</TableCell>
                    
                    {/* New Status Cell */}
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button 
                            size="sm" 
                            variant="flat"
                            className={`text-xs px-2 py-1 ${shipment.status === "Shipped" ? "bg-[#98FB98]" : ""}`}
                          >
                            <div className="flex flex-col items-start">
                              <span>{statusInfo.label}</span>
                              <span className="text-[10px] text-default-500">{statusInfo.translation}</span>
                            </div>
                            <Icon icon="lucide:chevron-down" className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu 
                          aria-label="Статус отправления"
                          onAction={(key) => handleStatusChange(shipment.id, key as ShipmentStatus)}
                          selectedKeys={[shipment.status || "Sent"]}
                          selectionMode="single"
                        >
                          <DropdownItem key="Sent">Отправлено (已发送)</DropdownItem>
                          <DropdownItem key="Processing">В обработке (处理中)</DropdownItem>
                          <DropdownItem key="Shipped">Доставляется (运输中)</DropdownItem>
                          <DropdownItem key="Delivered">Доставлено (已送达)</DropdownItem>
                          <DropdownItem key="Returned">Возвращено (已退回)</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm">{shipment.trackNumber}</span>
                        <Tooltip content="Копировать номер">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => navigator.clipboard.writeText(shipment.trackNumber)}
                          >
                            <Icon icon="lucide:copy" className="h-3.5 w-3.5" />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                    
                    <TableCell>{shipment.numberOfItems}</TableCell>
                    <TableCell>{shipment.numberOfPlaces}</TableCell>
                    <TableCell>{shipment.totalWeight}</TableCell>
                    <TableCell>${shipment.usdRatePerKg}</TableCell>
                    <TableCell>${shipment.deliveryPrice.toFixed(2)}</TableCell>
                    <TableCell>${shipment.packingPrice.toFixed(2)}</TableCell>
                    <TableCell>${shipment.goodsCost.toFixed(2)}</TableCell>
                    <TableCell>${shipment.insuranceCost.toFixed(2)}</TableCell>
                    <TableCell>${shipment.moscowDelivery.toFixed(2)}</TableCell>
                    <TableCell>${shipment.compensationAmount.toFixed(2)}</TableCell>
                    <TableCell className="font-medium text-primary">${shipment.totalAmount.toFixed(2)}</TableCell>
                    
                    <TableCell>
                      <Tooltip content={shipment.giveToChineseNotes || "Нет заметок"}>
                        <div className="max-w-[100px] truncate text-xs">
                          {shipment.giveToChineseNotes || "-"}
                        </div>
                      </Tooltip>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-2">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                              <Icon icon="lucide:more-vertical" className="h-4 w-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Действия">
                            <DropdownItem
                              startContent={<Icon icon="lucide:edit" className="h-4 w-4" />}
                              onPress={() => handleEdit(shipment)}
                            >
                              Редактировать
                            </DropdownItem>
                            <DropdownItem
                              startContent={<Icon icon="lucide:trash" className="h-4 w-4 text-danger" />}
                              className="text-danger"
                              onPress={() => handleDelete(shipment.id)}
                            >
                              Удалить
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        
        <div className="mt-4 text-sm text-default-400">
          Showing {items.length} of {shipments.length} shipments
        </div>
      </Card>
      
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {isEditing ? "Редактировать отправление" : "Добавить новое отправление"}
              </ModalHeader>
              <ModalBody>
                <ShipmentForm 
                  initialData={currentShipment} 
                  onSubmit={handleSubmit} 
                  onCancel={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};