import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <Layout>
      <div className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <img 
            src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2938&auto=format&fit=crop" 
            alt="About Background" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
              The APEX <br/> Philosophy
            </h1>
            <p className="text-xl text-muted-foreground font-sans normal-case leading-relaxed mb-12">
              We don't build activewear. We engineer performance equipment. 
              APEX was born from an obsession with the intersection of luxury 
              aesthetics and relentless athletic function.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="aspect-square bg-secondary">
             <img 
              src="https://images.unsplash.com/photo-1552674605-15c3711252ce?q=80&w=2938&auto=format&fit=crop" 
              alt="Craftsmanship" 
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Uncompromising Craft</h2>
            <p className="text-muted-foreground font-sans normal-case leading-relaxed mb-6">
              Every seam, every fabric choice, every silhouette is tested by elite athletes before it reaches production. We source the most advanced technical fabrics globally and assemble them with precision.
            </p>
            <p className="text-muted-foreground font-sans normal-case leading-relaxed">
              When you wear APEX, you are wearing gear that refuses to fail, wrapped in a stealth, cinematic aesthetic that commands attention.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Join The Elite</h2>
           <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold" asChild>
             <Link href="/shop">Experience APEX</Link>
           </Button>
        </div>
      </div>
    </Layout>
  );
}
