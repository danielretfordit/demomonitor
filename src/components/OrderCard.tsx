import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  orderNumber: string;
  delay?: number;
}

const OrderCard = ({ orderNumber, delay = 0 }: OrderCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "glass-card order-pulse relative overflow-hidden rounded-2xl p-8 transition-all duration-500",
        isVisible ? "slide-up opacity-100" : "opacity-0"
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 ring-2 ring-success">
          <svg
            className="h-8 w-8 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Заказ готов
          </p>
          <p className="mt-1 text-6xl font-bold tracking-tight text-foreground">
            {orderNumber}
          </p>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-success to-transparent" />
    </div>
  );
};

export default OrderCard;
