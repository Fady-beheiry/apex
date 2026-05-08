import { Layout } from "@/components/layout";
import { useListCategories } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function Categories() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Collections</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base font-sans normal-case">
            Curated gear for every discipline.
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse aspect-square bg-secondary"></div>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/shop?category=${category.slug}`} className="group block relative aspect-square overflow-hidden bg-secondary">
                {category.imageUrl && (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="text-3xl font-black uppercase tracking-widest text-white mb-2">
                    {category.name}
                  </h2>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/80 border-b border-white/0 group-hover:border-white/80 transition-colors pb-1">
                    Shop Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/30">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-2">No collections found</h3>
          </div>
        )}
      </div>
    </Layout>
  );
}
