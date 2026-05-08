import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Image as ImageIcon,
  LogOut,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAuth();
  const [location] = useLocation();

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-secondary/20 border-r border-border">
      <div className="p-6 border-b border-border">
        <Link href="/admin/dashboard" className="text-2xl font-black tracking-tighter block mb-2">APEX ADMIN</Link>
        {admin && <p className="text-xs text-muted-foreground uppercase tracking-widest">{admin.email}</p>}
      </div>
      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navLinks.map((link) => {
          const isActive = location.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href}>
              <span className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-none transition-colors ${
                isActive 
                  ? "bg-white text-black" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}>
                <link.icon className="h-4 w-4" />
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none uppercase tracking-widest font-bold text-xs"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border p-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-xl font-black tracking-tighter">APEX ADMIN</Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-border">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
