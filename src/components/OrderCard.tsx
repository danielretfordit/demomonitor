import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  orderNumber: string;
  status: 'waiting' | 'collecting' | 'ready' | 'problem' | 'cashier' | 'return';
  delay?: number;
}

const statusConfig = {
  waiting: {
    bgColor: 'bg-white/95',
    borderColor: 'border-gray-300',
    accentColor: 'bg-gray-400',
    textColor: 'text-gray-900',
    label: 'Ожидает отбора',
  },
  collecting: {
    bgColor: 'bg-yellow-400/95',
    borderColor: 'border-yellow-500',
    accentColor: 'bg-yellow-600',
    textColor: 'text-gray-900',
    label: 'Собирается',
  },
  ready: {
    bgColor: 'bg-green-500/95',
    borderColor: 'border-green-600',
    accentColor: 'bg-green-700',
    textColor: 'text-white',
    label: 'Подойдите на выдачу товара',
  },
  problem: {
    bgColor: 'bg-red-500/95',
    borderColor: 'border-red-600',
    accentColor: 'bg-red-700',
    textColor: 'text-white',
    label: 'Обратитесь к менеджеру',
  },
  cashier: {
    bgColor: 'bg-blue-500/95',
    borderColor: 'border-blue-600',
    accentColor: 'bg-blue-700',
    textColor: 'text-white',
    label: 'Подойдите к кассе',
  },
  return: {
    bgColor: 'bg-orange-500/95',
    borderColor: 'border-orange-600',
    accentColor: 'bg-orange-700',
    textColor: 'text-white',
    label: '↩ Обр. реализация',
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
        "relative overflow-hidden rounded-xl p-3 transition-all duration-500 border-2",
        config.bgColor,
        config.borderColor,
        isVisible ? "slide-up opacity-100" : "opacity-0"
      )}
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className={cn("text-[10px] font-semibold uppercase tracking-wide mb-1 leading-tight", config.textColor)}>
            {config.label}
          </p>
          <p className={cn("mt-1 text-3xl font-bold tracking-tight", config.textColor)}>
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
