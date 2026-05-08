import { Layout } from "@/components/layout";
import { useCart } from "@/lib/cart";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOrder } from "@workspace/api-client-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const createOrder = useCreateOrder();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const shippingFee = 15;
  const finalTotal = totalPrice + shippingFee;

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const order = await createOrder.mutateAsync({
        data: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          notes: formData.notes || null,
          shippingFee,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null,
          }))
        }
      });

      toast.success("Order Placed Successfully", {
        description: `Order #${order.orderNumber} has been confirmed.`
      });
      clearCart();
      setLocation(`/order-tracking?id=${order.orderNumber}`);
    } catch (error) {
      toast.error("Failed to place order", {
        description: "Please check your details and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold uppercase tracking-wide mb-6 pb-2 border-b border-border">Shipping Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Full Name *</Label>
                  <Input 
                    id="fullName" 
                    required 
                    className="bg-background border-border rounded-none h-12"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    required 
                    className="bg-background border-border rounded-none h-12"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Street Address *</Label>
                <Input 
                  id="address" 
                  required 
                  className="bg-background border-border rounded-none h-12"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">City *</Label>
                  <Input 
                    id="city" 
                    required 
                    className="bg-background border-border rounded-none h-12"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Payment Method</Label>
                  <div className="h-12 border border-border flex items-center px-4 text-sm font-bold bg-secondary/20">
                    Cash on Delivery
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Delivery Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  className="bg-background border-border rounded-none min-h-[100px] resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold h-14 mt-8"
              >
                {isLoading ? "Processing..." : "Confirm Order"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-secondary/20 border border-border p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-bold uppercase tracking-wide mb-6 pb-2 border-b border-border/50">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-secondary flex-shrink-0">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1 text-sm">
                      <div>
                        <h4 className="font-bold uppercase tracking-wide truncate">{item.name}</h4>
                        <div className="text-xs text-muted-foreground font-sans normal-case mt-1">
                          Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                        </div>
                      </div>
                      <div className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-sm font-sans normal-case pt-6 border-t border-border/50">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping (Express)</span>
                  <span className="font-bold">${shippingFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-black text-xl mt-6 pt-6 border-t border-border">
                <span className="uppercase tracking-tighter">Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
