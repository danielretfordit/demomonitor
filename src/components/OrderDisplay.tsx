import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import armtekLogo from "@/assets/armtek-logo.png";

interface Order {
  id: string;
  orderNumber: string;
  status: 'ready' | 'problem' | 'collecting' | 'cashier';
}

const OrderDisplay = () => {
  const [orders, setOrders] = useState<Order[]>(
    Array.from({ length: 50 }, (_, i) => {
      const statuses: ('ready' | 'problem' | 'collecting' | 'cashier')[] = ['ready', 'problem', 'collecting', 'cashier'];
      return {
        id: String(i + 1),
        orderNumber: String(Math.floor(Math.random() * 9000 + 1000)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
    })
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate new orders coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const newOrderNumber = Math.floor(Math.random() * 9000 + 1000).toString();
      const statuses: ('ready' | 'problem' | 'collecting' | 'cashier')[] = ['ready', 'problem', 'collecting', 'cashier'];
      const newOrder = {
        id: Date.now().toString(),
        orderNumber: newOrderNumber,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };

      setOrders((prev) => {
        const updated = [newOrder, ...prev];
        return updated.slice(0, 50); // Keep max 50 orders
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#172027]">
      {/* Header */}
      <header className="relative z-10 bg-[#30393f] border-b border-gray-700">
        <div className="container mx-auto flex items-center justify-between px-8 py-4">
          <div className="flex items-center space-x-6">
            <img src={armtekLogo} alt="Armtek" className="h-10 w-auto" />
            <div className="h-8 w-px bg-gray-600" />
            <h1 className="text-2xl font-bold text-white">Готовые заказы</h1>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Количество
              </p>
              <p className="text-2xl font-bold text-primary">{orders.length}</p>
            </div>
            
            <div className="h-10 w-px bg-gray-600" />
            
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Время
              </p>
              <p className="text-2xl font-bold text-white">
                {currentTime.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-6 py-6">
        {orders.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-6xl">🎉</div>
              <p className="text-2xl font-semibold text-muted-foreground">
                Все заказы выданы
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {orders.map((order, index) => (
              <OrderCard
                key={order.id}
                orderNumber={order.orderNumber}
                status={order.status}
                delay={index * 10}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer status bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 border-t border-border/50 bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-success" />
              <span className="text-sm font-medium text-muted-foreground">
                Система активна
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrderDisplay;
