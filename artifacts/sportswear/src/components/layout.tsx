import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart-drawer";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { totalItems, setIsDrawerOpen } = useCart();

  const navLinks = [
    { href: "/shop", label: "Shop All" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/best-sellers", label: "Best Sellers" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About APEX" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Announcement Bar */}
      <div className="bg-foreground text-background py-2 text-center text-xs font-bold tracking-widest uppercase">
        Free Global Shipping on Orders Over $200
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Mobile Menu */}
          <div className="flex-1 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] border-border bg-background p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border">
                    <Link href="/" className="text-2xl font-black tracking-tighter">APEX</Link>
                  </div>
                  <nav className="flex-1 p-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        className="text-lg font-medium hover:text-white/70 transition-colors uppercase tracking-wider"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 gap-6">
            {navLinks.slice(0, 3).map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-sm font-medium hover:text-white/70 transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-3xl font-black tracking-tighter flex items-center justify-center">
              APEX
            </Link>
          </div>

          {/* Actions */}
          <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(true)} className="relative">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="text-4xl font-black tracking-tighter mb-4 block">APEX</Link>
              <p className="text-muted-foreground max-w-sm font-sans normal-case text-sm leading-relaxed mb-6">
                Engineered for the elite. APEX redefines athletic performance through uncompromising luxury and obsessive craftsmanship.
              </p>
              <div className="flex gap-4">
                {/* Socials placeholder */}
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">X</div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">IG</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
                <li><Link href="/new-arrivals" className="hover:text-foreground transition-colors">New Arrivals</Link></li>
                <li><Link href="/best-sellers" className="hover:text-foreground transition-colors">Best Sellers</Link></li>
                <li><Link href="/categories" className="hover:text-foreground transition-colors">Collections</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/order-tracking" className="hover:text-foreground transition-colors">Track Order</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-sans normal-case">
            <p>© {new Date().getFullYear()} APEX Athletics. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Secured Checkout</span>
              <span>Global Delivery</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
