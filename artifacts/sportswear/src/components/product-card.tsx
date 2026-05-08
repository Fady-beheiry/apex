import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, setIsDrawerOpen } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Quick add default size/color if available, otherwise just add
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      size: product.sizes?.[0],
      color: product.colors?.[0],
    });
    setIsDrawerOpen(true);
  };

  return (
    <Link href={`/shop/${product.id}`} className="group block relative">
      <div className="aspect-[3/4] overflow-hidden bg-secondary relative mb-4">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-2xl tracking-tighter">
            APEX
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-white/20">
              Best Seller
            </span>
          )}
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 bg-gradient-to-t from-black/80 to-transparent">
          <Button 
            onClick={handleQuickAdd}
            className="w-full bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest text-xs font-bold"
          >
            Quick Add
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wide leading-tight group-hover:text-gray-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {product.categoryName || 'Performance'}
          </p>
        </div>
        <div className="text-right">
          <span className="font-bold text-sm block">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-muted-foreground line-through block mt-0.5">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
