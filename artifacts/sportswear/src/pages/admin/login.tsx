import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@apex.com");
  const [password, setPassword] = useState("admin123");
  const [, setLocation] = useLocation();
  const { login, admin, isLoading: authLoading } = useAuth();
  
  const adminLogin = useAdminLogin();

  useEffect(() => {
    if (admin && !authLoading) {
      setLocation("/admin/dashboard");
    }
  }, [admin, authLoading, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminLogin.mutateAsync({
        data: { email, password }
      });
      login(response.token, response.admin);
      toast.success("Welcome back, Commander");
      setLocation("/admin/dashboard");
    } catch (error) {
      toast.error("Access Denied", {
        description: "Invalid credentials. Please try again."
      });
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground uppercase tracking-widest font-bold">Verifying Access...</div>;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">APEX</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Command Center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/30 border-border rounded-none h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/30 border-border rounded-none h-12"
              />
            </div>
            <Button 
              type="submit" 
              disabled={adminLogin.isPending}
              className="w-full bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold h-14"
            >
              {adminLogin.isPending ? "Authenticating..." : "Access System"}
            </Button>
          </form>
        </div>
      </div>
      
      <div className="hidden lg:block lg:w-1/2 relative bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2935&auto=format&fit=crop" 
          alt="Admin Login" 
          className="w-full h-full object-cover grayscale contrast-125 opacity-40"
        />
      </div>
    </div>
  );
}
