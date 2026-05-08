import { useCart } from "@/lib/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";

export function CartDrawer() {
  const { items, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem, totalPrice } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    setLocation("/checkout");
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="w-full sm:max-w-md border-border bg-background/95 backdrop-blur-xl p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border/50 text-left">
          <SheetTitle className="text-2xl font-black uppercase tracking-tighter">Your Bag ({items.length})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted flex items-center justify-center opacity-50">
                <span className="text-2xl">0</span>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider mb-2">Your bag is empty</p>
                <p className="text-sm text-muted-foreground font-sans normal-case">Looks like you haven't added any gear yet.</p>
              </div>
              <Button onClick={() => setIsDrawerOpen(false)} className="mt-4" asChild>
                <Link href="/shop">Explore Collections</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-24 h-24 bg-secondary rounded-none overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground font-bold">APEX</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold uppercase tracking-wide text-sm pr-4 line-clamp-2">{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span>|</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-border">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/50 p-6 bg-background/50 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-muted-foreground uppercase tracking-wider">Subtotal</span>
              <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6 font-sans normal-case">
              Shipping and taxes calculated at checkout.
            </p>
            <Button onClick={handleCheckout} className="w-full py-6 text-sm font-bold uppercase tracking-widest flex items-center justify-between group">
              <span>Secure Checkout</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
