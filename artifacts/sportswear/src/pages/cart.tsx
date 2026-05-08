import { Layout } from "@/components/layout";
import { useCart } from "@/lib/cart";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center max-w-lg">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">Your Bag is Empty</h1>
          <p className="text-muted-foreground font-sans normal-case mb-12">
            You haven't added any elite performance gear to your bag yet.
          </p>
          <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold" asChild>
            <Link href="/shop">Explore Collections</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">Review Bag</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs uppercase tracking-widest font-bold text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 md:items-center border-b border-border pb-8 last:border-0 last:pb-0">
                  
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    <div className="w-24 h-32 md:w-32 md:h-40 bg-secondary flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold">APEX</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold uppercase tracking-wide text-sm mb-2">{item.name}</h3>
                        <div className="text-xs text-muted-foreground font-sans normal-case space-y-1">
                          {item.size && <p>Size: {item.size}</p>}
                          {item.color && <p>Color: {item.color}</p>}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-white flex items-center gap-2 mt-4"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-3 flex md:justify-center items-center mt-4 md:mt-0">
                    <div className="flex items-center border border-border h-12">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-12 h-full flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-12 h-full flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-3 flex justify-end items-center mt-4 md:mt-0 font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-secondary/20 border border-border p-8 sticky top-24">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-sans normal-case mb-8 border-b border-border/50 pb-8">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between font-bold mb-8">
                <span className="uppercase tracking-wider">Estimated Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Button size="lg" className="w-full bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold h-14 group" asChild>
                <Link href="/checkout" className="flex items-center justify-between">
                  <span>Secure Checkout</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
