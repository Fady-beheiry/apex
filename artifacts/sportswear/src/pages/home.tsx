import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  useListFeaturedProducts,
  useListNewArrivals,
  useListBestSellers,
  useListCategories,
} from "@workspace/api-client-react";
import { ArrowRight, ShoppingBag } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85&auto=format&fit=crop";

function ProductCard({ product }: { product: { id: number; name: string; price: number; comparePrice?: number | null; imageUrl: string; isNew?: boolean; isBestSeller?: boolean } }) {
  return (
    <Link href={`/shop/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-secondary aspect-[3/4] mb-3">
        <img
          src={`${product.imageUrl}&w=600&q=80`}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"; }}
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-black tracking-widest px-2 py-1 uppercase">New</span>
        )}
        {product.isBestSeller && !product.isNew && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-black tracking-widest px-2 py-1 uppercase">Best Seller</span>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-white text-black text-xs font-black tracking-widest py-3 uppercase flex items-center justify-center gap-2 hover:bg-gray-100">
            <ShoppingBag size={13} /> Quick Add
          </button>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold tracking-wide uppercase truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-bold">${product.price}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">${product.comparePrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ label, title, href }: { label: string; title: string; href: string }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">{label}</p>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{title}</h2>
      </div>
      <Link href={href} className="hidden sm:flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-white transition-colors">
        View All <ArrowRight size={13} />
      </Link>
    </div>
  );
}

export default function Home() {
  const { data: featured } = useListFeaturedProducts();
  const { data: newArrivals } = useListNewArrivals();
  const { data: bestSellers } = useListBestSellers();
  const { data: categories } = useListCategories();

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative h-[92vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
          <img
            src={HERO_IMAGE}
            alt="APEX Hero"
            className="w-full h-full object-cover object-center opacity-60 grayscale contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6 font-semibold">
            New Season — 2026 Pro Series
          </p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-none mb-6">
            Push The{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              Limits
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed">
            Uncompromising performance wear engineered for the elite.
            The new APEX Pro Series is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="px-10 py-6 text-xs tracking-widest font-black bg-white text-black hover:bg-gray-200 rounded-none border-none uppercase"
              asChild
            >
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-6 text-xs tracking-widest font-black rounded-none border-white/30 hover:bg-white/10 uppercase"
              asChild
            >
              <Link href="/new-arrivals">Explore Pro Series</Link>
            </Button>
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 opacity-50">
          <div className="w-px h-8 bg-white/50 animate-pulse" />
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="border-y border-border py-4 overflow-hidden bg-secondary/40">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="text-sm font-black uppercase tracking-[0.3em] mx-8 text-muted-foreground/40">
              Performance Without Compromise •
            </span>
          ))}
        </div>
      </div>

      {/* ── Shop by Collection ── */}
      <section className="px-4 md:px-8 lg:px-16 py-20 max-w-screen-xl mx-auto w-full">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">Browse</p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Shop by Collection</h2>
        </div>

        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-secondary block">
                <img
                  src={`${cat.imageUrl}&w=500&q=80`}
                  alt={cat.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-white">{cat.name}</p>
                  <p className="text-[10px] text-white/60 mt-0.5">{cat.productCount} styles</p>
                </div>
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-all duration-300" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />
            ))}
          </div>
        )}
      </section>

      {/* ── Featured Products ── */}
      {featured && featured.length > 0 && (
        <section className="px-4 md:px-8 lg:px-16 py-16 max-w-screen-xl mx-auto w-full border-t border-border">
          <SectionHeader label="Curated for you" title="Featured" href="/shop" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="px-4 md:px-8 lg:px-16 py-16 max-w-screen-xl mx-auto w-full border-t border-border">
          <SectionHeader label="Just dropped" title="New Arrivals" href="/new-arrivals" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={{ ...p, isNew: true }} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" className="rounded-none border-white/20 px-10 py-5 text-xs tracking-widest font-black uppercase hover:bg-white hover:text-black transition-colors" asChild>
              <Link href="/new-arrivals">View All New Arrivals <ArrowRight size={13} className="ml-2" /></Link>
            </Button>
          </div>
        </section>
      )}

      {/* ── Best Sellers ── */}
      {bestSellers && bestSellers.length > 0 && (
        <section className="px-4 md:px-8 lg:px-16 py-16 max-w-screen-xl mx-auto w-full border-t border-border">
          <SectionHeader label="Community favourites" title="Best Sellers" href="/best-sellers" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={{ ...p, isBestSeller: true }} />
            ))}
          </div>
        </section>
      )}

      {/* ── Full-width CTA Banner ── */}
      <section className="relative overflow-hidden h-[400px] flex items-center justify-center mt-8">
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80&auto=format&fit=crop"
          alt="APEX Pro Series"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background" />
        <div className="relative z-10 text-center px-4">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3 font-semibold">Limited Edition</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            The Pro Series
          </h2>
          <Button
            size="lg"
            className="rounded-none bg-white text-black hover:bg-gray-200 px-10 text-xs tracking-widest font-black uppercase"
            asChild
          >
            <Link href="/new-arrivals">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* ── Footer spacing ── */}
      <div className="h-20" />
    </Layout>
  );
}
