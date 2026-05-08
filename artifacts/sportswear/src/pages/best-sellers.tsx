import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useListBestSellers } from "@workspace/api-client-react";

export default function BestSellers() {
  const { data: products, isLoading } = useListBestSellers();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Best Sellers</h1>
          <p className="text-muted-foreground max-w-2xl text-sm md:text-base font-sans normal-case">
            Tried, tested, and trusted by the elite. Our most coveted performance pieces.
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-secondary mb-4"></div>
                <div className="h-4 bg-secondary w-2/3 mb-2"></div>
                <div className="h-4 bg-secondary w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/30">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-2">Nothing here yet</h3>
            <p className="text-muted-foreground font-sans normal-case">Check back soon.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
