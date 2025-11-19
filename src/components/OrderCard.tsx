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
        "glass-card order-pulse relative overflow-hidden rounded-xl p-4 transition-all duration-500",
        isVisible ? "slide-up opacity-100" : "opacity-0"
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Заказ
          </p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-foreground">
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
