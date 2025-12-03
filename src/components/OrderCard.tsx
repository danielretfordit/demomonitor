import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OrderCardProps {
  orderNumber: string;
  status: 'ready' | 'problem' | 'collecting' | 'cashier' | 'new';
  delay?: number;
}

const statusConfig = {
  ready: {
    bgColor: 'bg-green-500/40',
    borderColor: 'border-green-500',
    accentColor: 'bg-green-500',
    textColor: 'text-white',
    numberColor: 'text-white',
    label: 'Готов к выдаче',
    statusLabel: 'Готов',
  },
  problem: {
    bgColor: 'bg-red-500/40',
    borderColor: 'border-red-500',
    accentColor: 'bg-red-500',
    textColor: 'text-white',
    numberColor: 'text-white',
    label: 'Обратитесь к продавцу',
    statusLabel: 'Проблема',
  },
  collecting: {
    bgColor: 'bg-yellow-500/40',
    borderColor: 'border-yellow-500',
    accentColor: 'bg-yellow-500',
    textColor: 'text-white',
    numberColor: 'text-white',
    label: 'Заказ собирается',
    statusLabel: 'Собирается',
  },
  cashier: {
    bgColor: 'bg-blue-500/40',
    borderColor: 'border-blue-500',
    accentColor: 'bg-blue-500',
    textColor: 'text-white',
    numberColor: 'text-white',
    label: 'Подойдите к кассе',
    statusLabel: 'Касса',
  },
  new: {
    bgColor: 'bg-gray-700/50',
    borderColor: 'border-white',
    accentColor: 'bg-white',
    textColor: 'text-white',
    numberColor: 'text-white',
    label: 'Ожидает отбора',
    statusLabel: 'Новый',
  },
};

const OrderCard = ({ orderNumber, status, delay = 0 }: OrderCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const config = statusConfig[status];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Мокированные данные для попапа
  const orderDetails = {
    client: "100539527, Дарья Николаевна Давидович",
    buyer: "100639527, Дарья Николаевна Давидович",
    paymentStatus: "оплачено",
    status: config.label,
    proforma: "177423640",
    order: "2004252158",
    delivery: "8078326095",
    invoice: "9017433299",
    documentsIssued: "Нет",
    openOrders: "Есть",
    released: "да",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative overflow-hidden rounded-xl px-2 pt-2 pb-3 transition-all duration-500 border-2 shadow-lg hover:shadow-xl cursor-pointer",
            config.bgColor,
            config.borderColor,
            isVisible ? "slide-up opacity-100" : "opacity-0"
          )}
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)',
            minWidth: '120px',
            width: '120px',
            height: '90px',
          }}
        >
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-0.5">
            <p className={cn("text-xs font-semibold uppercase tracking-wide", config.textColor)}>
              {config.statusLabel}
            </p>
            <p className={cn("text-4xl font-bold leading-none -mt-0.5", config.numberColor)}>
              {orderNumber}
            </p>
          </div>

          {/* Bottom accent */}
          <div className={cn("absolute bottom-0 left-0 right-0 h-1", config.accentColor)} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-card border-border">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-foreground border-b border-border pb-2">
            Подробная информация
          </h4>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Клиент:</span>
              <span className="text-foreground text-right flex-1 ml-2">{orderDetails.client}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Покупатель:</span>
              <span className="text-foreground text-right flex-1 ml-2">{orderDetails.buyer}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Статус платежа:</span>
              <span className="text-foreground">{orderDetails.paymentStatus}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Статус:</span>
              <span className="text-foreground">{orderDetails.status}</span>
            </div>
            
            <div className="border-t border-border pt-2 mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Проформа:</span>
                <span className="text-foreground">{orderDetails.proforma}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Заказ:</span>
                <span className="text-foreground">{orderDetails.order}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Поставка:</span>
                <span className="text-foreground">{orderDetails.delivery}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Фактура:</span>
                <span className="text-foreground">{orderDetails.invoice}</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-2 mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Документы выписаны:</span>
                <span className="text-foreground">{orderDetails.documentsIssued}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Открытые тр. заказы:</span>
                <span className="text-foreground">{orderDetails.openOrders}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Отпуск произведен:</span>
                <span className="text-foreground">{orderDetails.released}</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OrderCard;
