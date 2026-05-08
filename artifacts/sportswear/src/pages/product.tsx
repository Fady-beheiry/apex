import { Layout } from "@/components/layout";
import { useRoute } from "wouter";
import { useGetProduct, getGetProductQueryKey, useListProductReviews, useCreateProductReview, getListProductReviewsQueryKey } from "@workspace/api-client-react";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProductDetail() {
  const [, params] = useRoute("/shop/:id");
  const id = Number(params?.id);
  const { addItem, setIsDrawerOpen } = useCart();

  const { data: product, isLoading } = useGetProduct(id, { 
    query: { enabled: !!id, queryKey: getGetProductQueryKey(id) } 
  });

  const { data: reviews } = useListProductReviews(id, {
    query: { queryKey: getListProductReviewsQueryKey(id), enabled: !!id }
  });

  const createReview = useCreateProductReview();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      size: selectedSize || product.sizes?.[0],
      color: selectedColor || product.colors?.[0],
    });
    setIsDrawerOpen(true);
  };

  if (isLoading || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 md:py-24 h-screen">
          <div className="animate-pulse flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2 aspect-[3/4] bg-secondary"></div>
            <div className="w-full md:w-1/2 space-y-4 pt-12">
              <div className="h-10 bg-secondary w-3/4"></div>
              <div className="h-6 bg-secondary w-1/4"></div>
              <div className="h-24 bg-secondary w-full mt-8"></div>
              <div className="h-12 bg-secondary w-full mt-8"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-muted-foreground uppercase tracking-widest font-bold mb-8 gap-2">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-foreground">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          {product.categoryName && (
            <>
              <Link href={`/shop?category=${product.categoryName}`} className="hover:text-foreground">{product.categoryName}</Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-secondary overflow-hidden">
              {allImages[0] ? (
                <img src={allImages[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-4xl">APEX</div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square bg-secondary overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={img} alt={`${product.name} detail ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
              {product.comparePrice && product.comparePrice > product.price && (
                <div className="text-lg text-muted-foreground line-through">${product.comparePrice.toFixed(2)}</div>
              )}
            </div>

            <div className="prose prose-invert prose-p:font-sans prose-p:normal-case prose-p:text-muted-foreground mb-10 max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="space-y-8 mt-auto">
              
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="uppercase tracking-widest text-xs font-bold">Color</span>
                    <span className="text-xs text-muted-foreground font-sans normal-case">{selectedColor || product.colors[0]}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border text-sm font-bold uppercase tracking-wider transition-colors ${
                          (selectedColor === color) || (!selectedColor && color === product.colors![0])
                            ? 'border-white bg-white text-black'
                            : 'border-border bg-transparent text-muted-foreground hover:border-white/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="uppercase tracking-widest text-xs font-bold">Size</span>
                    <button className="text-xs text-muted-foreground hover:text-white underline underline-offset-4">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 flex items-center justify-center border text-sm font-bold uppercase tracking-wider transition-colors ${
                          (selectedSize === size) || (!selectedSize && size === product.sizes![0])
                            ? 'border-white bg-white text-black'
                            : 'border-border bg-transparent text-muted-foreground hover:border-white/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="pt-6 border-t border-border">
                <Button 
                  size="lg" 
                  className="w-full bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold h-16 text-sm"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
                </Button>
                {product.stock > 0 && product.stock < 10 && (
                  <p className="text-xs text-destructive text-center mt-4 uppercase tracking-wider font-bold">
                    Only {product.stock} items left
                  </p>
                )}
              </div>

              {/* Accordions */}
              <div className="border-t border-border pt-8 space-y-4 text-sm font-sans normal-case text-muted-foreground">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="font-bold text-white uppercase tracking-wider text-xs">Shipping</span>
                  <span>Complimentary express delivery</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="font-bold text-white uppercase tracking-wider text-xs">Returns</span>
                  <span>30-day global returns</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 pt-16 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Elite Feedback</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-white">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(product.averageRating || 0) ? 'fill-current' : 'fill-muted/20 text-muted/20'}`} />
                  ))}
                </div>
                <span className="font-bold">{product.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-muted-foreground text-sm font-sans normal-case">({product.reviewCount} Reviews)</span>
              </div>
            </div>
            
            <Button variant="outline" className="rounded-none border-border">Write a Review</Button>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map(review => (
                <div key={review.id} className="bg-secondary/20 p-6 border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold uppercase tracking-wider text-sm">{review.customerName}</span>
                    <span className="text-xs text-muted-foreground font-sans normal-case">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex text-white mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'fill-muted/20 text-muted/20'}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground font-sans normal-case text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-sans normal-case">No reviews yet. Be the first to review this gear.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
