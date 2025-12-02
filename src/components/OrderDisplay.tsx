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
  isReturn?: boolean;
}

const OrderDisplay = () => {
  const [orders, setOrders] = useState<Order[]>(
    Array.from({ length: 50 }, (_, i) => {
      const statuses: ('ready' | 'problem' | 'collecting' | 'cashier')[] = ['ready', 'problem', 'collecting', 'cashier'];
      return {
        id: String(i + 1),
        orderNumber: String(Math.floor(Math.random() * 9000 + 1000)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        isReturn: Math.random() < 0.15, // 15% chance of being a return
      };
    })
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStore, setSelectedStore] = useState("Магазин №1");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(70);
  const [selectedStatuses, setSelectedStatuses] = useState<('ready' | 'problem' | 'collecting' | 'cashier')[]>([
    'ready', 'problem', 'collecting', 'cashier'
  ]);
  const [showReturns, setShowReturns] = useState(true);

  // Calculate cards per page based on viewport
  useEffect(() => {
    const calculateCardsPerPage = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 60; // approximate header height
      const footerHeight = 70; // approximate footer height
      const paddingTop = 24; // py-6
      const paddingBottom = 24; // py-6
      const gap = 16; // gap-4
      const cardHeight = 120; // approximate card height
      
      const availableHeight = viewportHeight - headerHeight - footerHeight - paddingTop - paddingBottom;
      const rows = Math.floor((availableHeight + gap) / (cardHeight + gap));
      
      // Calculate columns based on full viewport width (edge to edge)
      const viewportWidth = window.innerWidth;
      const horizontalPadding = 32; // minimal padding (16px on each side)
      const cardWidth = 120; // fixed card width
      
      const availableWidth = viewportWidth - horizontalPadding;
      const columns = Math.floor((availableWidth + gap) / (cardWidth + gap));
      
      setCardsPerPage(Math.max(rows * columns, 20)); // minimum 20 cards
    };

    calculateCardsPerPage();
    window.addEventListener('resize', calculateCardsPerPage);
    return () => window.removeEventListener('resize', calculateCardsPerPage);
  }, []);

  const stores = [
    "Магазин №1",
    "Магазин №2",
    "Магазин №3",
    "Магазин №4",
    "Магазин №5",
  ];

  // Filter and sort orders
  const getSortedOrders = (ordersToSort: Order[]) => {
    // Filter by selected statuses first
    let filtered = ordersToSort.filter(order => selectedStatuses.includes(order.status));
    // Filter by return status if needed
    if (!showReturns) {
      filtered = filtered.filter(order => !order.isReturn);
    }
    // Then sort by order number
    return filtered.sort((a, b) => 
      parseInt(a.orderNumber) - parseInt(b.orderNumber)
    );
  };

  const toggleStatus = (status: 'ready' | 'problem' | 'collecting' | 'cashier') => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Auto-rotate pages every 10 seconds
  useEffect(() => {
    const totalPages = Math.ceil(orders.length / cardsPerPage);
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        const next = prev + 1;
        return next > totalPages ? 1 : next;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [orders.length, cardsPerPage]);

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
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: newOrderNumber,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        isReturn: Math.random() < 0.15,
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
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Настройки</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Store selection */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Выбор магазина</h3>
                    <div className="space-y-2">
                      {stores.map((store) => (
                        <Button
                          key={store}
                          variant={selectedStore === store ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => {
                            setSelectedStore(store);
                          }}
                        >
                          {store}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Status filters */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Фильтр по статусам</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('ready')}
                          onChange={() => toggleStatus('ready')}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-10 rounded border-2 border-green-500 bg-green-500/30" />
                          <span className="text-sm">Готов</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('problem')}
                          onChange={() => toggleStatus('problem')}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-10 rounded border-2 border-red-500 bg-red-500/30" />
                          <span className="text-sm">Проблема</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('collecting')}
                          onChange={() => toggleStatus('collecting')}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-10 rounded border-2 border-yellow-500 bg-yellow-500/30" />
                          <span className="text-sm">Собирается</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('cashier')}
                          onChange={() => toggleStatus('cashier')}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-10 rounded border-2 border-blue-500 bg-blue-500/30" />
                          <span className="text-sm">На кассу</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Return filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Обратная реализация</h3>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showReturns}
                        onChange={() => setShowReturns(prev => !prev)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-10 rounded border-2 border-purple-500 bg-purple-500/30 flex items-center justify-center">
                          <span className="text-[8px] text-purple-300">↩</span>
                        </div>
                        <span className="text-sm">Показывать возвраты</span>
                      </div>
                    </label>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Применить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-4 py-6">
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
            <div className="grid gap-4 mb-6 justify-center" style={{ gridTemplateColumns: 'repeat(auto-fit, 120px)' }}>
              {getSortedOrders(orders)
                .slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage)
                .map((order, index) => (
                  <OrderCard
                    key={order.id}
                    orderNumber={order.orderNumber}
                    status={order.status}
                    isReturn={order.isReturn}
                    delay={index * 10}
                  />
                ))}
            </div>
            
            {orders.length > cardsPerPage && (
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
                        onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(orders.length / cardsPerPage), prev + 1))}
                        className={currentPage === Math.ceil(orders.length / cardsPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                <div className="flex items-center space-x-2.5">
                  <div className="h-5 w-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-[10px] text-white">↩</span>
                  </div>
                  <span className="text-foreground font-medium">Возврат</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {orders.length > cardsPerPage && (
                <>
                  <div className="text-sm text-muted-foreground">
                    Страница {currentPage} из {Math.ceil(orders.length / cardsPerPage)}
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
