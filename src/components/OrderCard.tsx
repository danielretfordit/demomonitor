import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  orderNumber: string;
  status: 'ready' | 'problem' | 'collecting' | 'cashier';
  delay?: number;
}

const statusConfig = {
  ready: {
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500',
    accentColor: 'bg-green-500',
    label: 'Готов',
  },
  problem: {
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500',
    accentColor: 'bg-red-500',
    label: 'Менеджер',
  },
  collecting: {
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500',
    accentColor: 'bg-yellow-500',
    label: 'Собирается',
  },
  cashier: {
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500',
    accentColor: 'bg-blue-500',
    label: 'Касса',
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

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-4 transition-all duration-500 border-2",
        config.bgColor,
        config.borderColor,
        isVisible ? "slide-up opacity-100" : "opacity-0"
      )}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className={cn("text-xs font-medium uppercase tracking-wider mb-1", config.accentColor.replace('bg-', 'text-'))}>
            {config.label}
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-white">
            {orderNumber}
          </p>
        </div>
      </div>

      {/* Bottom accent */}
      <div className={cn("absolute bottom-0 left-0 right-0 h-1", config.accentColor)} />
    </div>
  );
};

export default OrderCard;
