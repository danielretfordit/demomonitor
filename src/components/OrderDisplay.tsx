import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import armtekLogo from "@/assets/armtek-logo-new.png";
import gradientBg from "@/assets/gradient-bg.png";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [selectedStore, setSelectedStore] = useState("Магазин №1");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 70; // 10 columns x 7 rows

  const stores = [
    "Магазин №1",
    "Магазин №2",
    "Магазин №3",
    "Магазин №4",
    "Магазин №5",
  ];

  // Sort orders vertically (snake pattern by columns)
  const getSortedOrders = (ordersToSort: Order[]) => {
    const columns = 10;
    const rows = 7;
    const sorted: Order[] = [];
    
    // Sort by order number first
    const numberSorted = [...ordersToSort].sort((a, b) => 
      parseInt(a.orderNumber) - parseInt(b.orderNumber)
    );
    
    // Fill column by column
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        const index = col * rows + row;
        if (index < numberSorted.length) {
          sorted.push(numberSorted[index]);
        }
      }
    }
    
    return sorted;
  };

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
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${gradientBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border shadow-sm" style={{ backgroundColor: '#30393f' }}>
        <div className="container mx-auto flex items-center justify-between px-8 py-2.5">
          <div className="flex items-center space-x-6">
            <img src={armtekLogo} alt="Armtek" className="h-8 w-auto" />
            <div className="h-8 w-px bg-border" />
            <h1 className="text-2xl font-bold text-foreground">Статус самовывоза</h1>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Количество
              </p>
              <p className="text-2xl font-bold text-primary">{orders.length}</p>
            </div>
            
            <div className="h-10 w-px bg-border" />
            
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Время
              </p>
              <p className="text-2xl font-bold text-foreground">
                {currentTime.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="h-10 w-px bg-border" />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="rounded-lg bg-secondary p-2 text-secondary-foreground transition-colors hover:bg-secondary/80">
                  <Settings className="h-6 w-6" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Выбор магазина</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 py-4">
                  {stores.map((store) => (
                    <Button
                      key={store}
                      variant={selectedStore === store ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedStore(store);
                        setIsDialogOpen(false);
                      }}
                    >
                      {store}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
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
          <>
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 3xl:grid-cols-14 4xl:grid-cols-16 5xl:grid-cols-20 mb-6">
              {getSortedOrders(orders)
                .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
                .map((order, index) => (
                  <OrderCard
                    key={order.id}
                    orderNumber={order.orderNumber}
                    status={order.status}
                    delay={index * 10}
                  />
                ))}
            </div>
            
            {orders.length > ordersPerPage && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(orders.length / ordersPerPage), prev + 1))}
                        className={currentPage === Math.ceil(orders.length / ordersPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer status bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-card/95 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-5 text-base">
                <div className="flex items-center space-x-2.5">
                  <div className="h-5 w-14 rounded border-2 border-green-500 bg-green-500/30" />
                  <span className="text-foreground font-medium">Готов</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="h-5 w-14 rounded border-2 border-red-500 bg-red-500/30" />
                  <span className="text-foreground font-medium">Проблема</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="h-5 w-14 rounded border-2 border-yellow-500 bg-yellow-500/30" />
                  <span className="text-foreground font-medium">Собирается</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="h-5 w-14 rounded border-2 border-blue-500 bg-blue-500/30" />
                  <span className="text-foreground font-medium">На кассу</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {orders.length > ordersPerPage && (
                <>
                  <div className="text-sm text-muted-foreground">
                    Страница {currentPage} из {Math.ceil(orders.length / ordersPerPage)}
                  </div>
                  <div className="h-4 w-px bg-border" />
                </>
              )}
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrderDisplay;
