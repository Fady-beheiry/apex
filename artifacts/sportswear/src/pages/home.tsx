import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListFeaturedProducts, useListNewArrivals } from "@workspace/api-client-react";

export default function Home() {
  const { data: featured } = useListFeaturedProducts();
  const { data: newArrivals } = useListNewArrivals();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image / Video overlay (simulated) */}
        <div className="absolute inset-0 bg-secondary z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea8?q=80&w=2940&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-top opacity-50 grayscale contrast-125"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none mb-6">
            Push The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Limits</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-sans normal-case max-w-2xl mx-auto mb-10">
            Uncompromising performance wear engineered for the elite. 
            The new APEX Pro Series is here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="px-8 py-6 text-sm tracking-widest font-bold bg-white text-black hover:bg-gray-200 rounded-none border-none" asChild>
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-sm tracking-widest font-bold rounded-none border-white/20 hover:bg-white/10" asChild>
              <Link href="/new-arrivals">Explore Pro Series</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-border py-4 overflow-hidden bg-secondary/50">
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-xl font-black uppercase tracking-widest mx-8 text-muted-foreground/50">
              Performance Without Compromise •
            </span>
          ))}
        </div>
      </div>

      <div className="h-64 flex items-center justify-center">
        <p className="text-muted-foreground">More content coming soon...</p>
      </div>

    </Layout>
  );
}
