import { useEffect, useState, useRef } from "react";
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

interface Order {
  id: string;
  orderNumber: string;
  status: 'ready' | 'problem' | 'collecting' | 'cashier' | 'new';
}

const OrderDisplay = () => {
  const [orders, setOrders] = useState<Order[]>(
    Array.from({ length: 500 }, (_, i) => {
      const statuses: ('ready' | 'problem' | 'collecting' | 'cashier' | 'new')[] = ['ready', 'problem', 'collecting', 'cashier', 'new'];
      return {
        id: String(i + 1),
        orderNumber: String(1000 + i),
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
    })
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStore, setSelectedStore] = useState("Магазин №1");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(200);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStatuses, setSelectedStatuses] = useState<('ready' | 'problem' | 'collecting' | 'cashier' | 'new')[]>([
    'ready', 'problem', 'collecting', 'cashier', 'new'
  ]);
  
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Calculate cards per page based on actual measured elements
  useEffect(() => {
    const calculateCardsPerPage = () => {
      const header = headerRef.current;
      const footer = footerRef.current;
      
      if (!header || !footer) return;
      
      const headerHeight = header.getBoundingClientRect().height;
      const footerHeight = footer.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      const gap = 16;
      const cardHeight = 120;
      const cardWidth = 120;
      
      // Calculate available space (minimal padding)
      const availableHeight = viewportHeight - headerHeight - footerHeight - 4;
      // For N rows with gaps: N*cardHeight + (N-1)*gap <= availableHeight
      // N*(cardHeight+gap) - gap <= availableHeight
      // N <= (availableHeight + gap) / (cardHeight + gap)
      const rows = Math.floor((availableHeight + gap) / (cardHeight + gap));
      
      const availableWidth = viewportWidth - 32;
      const columns = Math.floor((availableWidth + gap) / (cardWidth + gap));
      
      const total = rows * columns;
      if (total > 0) {
        setCardsPerPage(total);
      }
    };

    const timer = setTimeout(calculateCardsPerPage, 100);
    window.addEventListener('resize', calculateCardsPerPage);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateCardsPerPage);
    };
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
    const filtered = ordersToSort.filter(order => selectedStatuses.includes(order.status));
    // Then sort by order number
    return filtered.sort((a, b) => 
      parseInt(a.orderNumber) - parseInt(b.orderNumber)
    );
  };

  const toggleStatus = (status: 'ready' | 'problem' | 'collecting' | 'cashier' | 'new') => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-pagination - cyclic page turning
  const filteredOrders = getSortedOrders(orders);
  const totalPages = Math.ceil(filteredOrders.length / cardsPerPage);
  
  useEffect(() => {
    if (totalPages <= 1) {
      setCurrentPage(0);
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); // 5 seconds per page

    return () => clearInterval(interval);
  }, [totalPages]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatuses]);

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
      <header ref={headerRef} className="relative z-10 border-b border-border shadow-sm" style={{ backgroundColor: '#30393f' }}>
        <div className="flex items-center justify-between px-4 py-2.5">
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
                      
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('new')}
                          onChange={() => toggleStatus('new')}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-10 rounded border-2 border-white bg-gray-700/50" />
                          <span className="text-sm">Новый</span>
                        </div>
                      </label>
                    </div>
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
      <main ref={mainRef} className="relative z-10 px-4 pt-1">
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
          <div className="grid gap-4 justify-center" style={{ gridTemplateColumns: 'repeat(auto-fit, 120px)' }}>
            {filteredOrders
              .slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)
              .map((order, index) => (
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
      <footer ref={footerRef} className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-card/95 backdrop-blur-sm shadow-lg">
        <div className="px-4 py-3">
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
                  <div className="h-5 w-14 rounded border-2 border-white bg-gray-700/50" />
                  <span className="text-foreground font-medium">Новый</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        i === currentPage ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
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
