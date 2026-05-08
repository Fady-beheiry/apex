import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState("newest");

  const { data: products, isLoading } = useListProducts({
    search: search || undefined,
    category: category !== "all" ? category : undefined,
  });

  const { data: categories } = useListCategories();

  const sortedProducts = products ? [...products] : [];
  if (sort === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Shop All</h1>
          <p className="text-muted-foreground max-w-2xl text-sm md:text-base font-sans normal-case">
            Uncompromising gear for the elite. Explore our full range of performance and lifestyle apparel.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 mb-8 items-start justify-between border-y border-border py-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search gear..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background border-border rounded-none"
              />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-none border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-none border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-border">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-secondary/30">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-2">No products found</h3>
            <p className="text-muted-foreground font-sans normal-case">We couldn't find any gear matching your current filters.</p>
            <Button 
              variant="outline" 
              className="mt-6 rounded-none border-border"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
