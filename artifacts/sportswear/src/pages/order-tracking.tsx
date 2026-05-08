import { Layout } from "@/components/layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTrackOrder } from "@workspace/api-client-react";
import { Search, Package, Truck, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function OrderTracking() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialOrderNumber = searchParams.get("id") || "";
  
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);

  const { data: order, isLoading, isError } = useTrackOrder(searchQuery, {
    query: {
      enabled: !!searchQuery && searchQuery.length > 3,
      retry: false
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setSearchQuery(orderNumber.trim());
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'on_the_way': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Track Order</h1>
          <p className="text-muted-foreground font-sans normal-case">
            Enter your APEX order number to track your elite gear.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-16">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Order Number (e.g. ORD-123...)" 
              className="pl-12 h-14 bg-secondary/30 border-border rounded-none text-lg font-mono uppercase"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-14 px-8 bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold">
            Track
          </Button>
        </form>

        {isLoading && (
          <div className="animate-pulse space-y-8">
            <div className="h-2 bg-secondary w-full"></div>
            <div className="h-40 bg-secondary w-full"></div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-12 bg-destructive/10 border border-destructive/20 text-destructive">
            <h3 className="font-bold uppercase tracking-wider mb-2">Order Not Found</h3>
            <p className="font-sans normal-case text-sm">Please check your order number and try again.</p>
          </div>
        )}

        {order && !isLoading && (
          <div className="space-y-12">
            
            {order.status === 'cancelled' ? (
              <div className="text-center py-12 bg-destructive/10 border border-destructive/20 text-destructive">
                <h3 className="font-bold uppercase tracking-wider mb-2">Order Cancelled</h3>
                <p className="font-sans normal-case text-sm">This order has been cancelled.</p>
              </div>
            ) : (
              <div className="relative pt-8">
                <div className="absolute top-12 left-0 right-0 h-1 bg-secondary -z-10"></div>
                <div 
                  className="absolute top-12 left-0 h-1 bg-white transition-all duration-500 ease-out -z-10"
                  style={{ width: `${(Math.max(currentStep - 1, 0) / 3) * 100}%` }}
                ></div>
                
                <div className="flex justify-between relative z-10">
                  {[
                    { title: 'Confirmed', icon: Package, step: 1 },
                    { title: 'Processing', icon: Package, step: 2 },
                    { title: 'In Transit', icon: Truck, step: 3 },
                    { title: 'Delivered', icon: CheckCircle, step: 4 },
                  ].map((s) => (
                    <div key={s.step} className="flex flex-col items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        currentStep >= s.step 
                          ? 'bg-white text-black border border-white' 
                          : 'bg-background border-2 border-secondary text-muted-foreground'
                      }`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs uppercase tracking-widest font-bold ${
                        currentStep >= s.step ? 'text-white' : 'text-muted-foreground'
                      }`}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-secondary/20 border border-border p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-border/50 pb-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-1">Order {order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground font-sans normal-case">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right">
                  <div className="text-sm text-muted-foreground font-sans normal-case mb-1">Total</div>
                  <div className="text-xl font-bold">${order.total.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">Items</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-16 bg-secondary flex-shrink-0">
                        {item.productImage && <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm uppercase tracking-wide">{item.productName}</div>
                        <div className="text-xs text-muted-foreground font-sans normal-case mt-1">
                          Qty: {item.quantity} {item.size && `| ${item.size}`} {item.color && `| ${item.color}`}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">Delivery Details</h4>
                  <p className="text-sm font-sans normal-case space-y-1">
                    <span className="block font-bold text-white">{order.fullName}</span>
                    <span className="block">{order.address}</span>
                    <span className="block">{order.city}</span>
                    <span className="block text-muted-foreground mt-2">{order.phone}</span>
                  </p>
                </div>
                <div>
                   <h4 className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">Payment</h4>
                   <p className="text-sm font-sans normal-case text-white font-bold">Cash on Delivery</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
