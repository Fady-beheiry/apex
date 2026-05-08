import { AdminLayout } from "@/components/admin-layout";
import { useGetAdminAnalytics } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { admin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!admin && !authLoading) {
      setLocation("/admin/login");
    }
  }, [admin, authLoading, setLocation]);

  const { data: analytics, isLoading } = useGetAdminAnalytics({
    query: {
      enabled: !!admin,
    }
  });

  if (authLoading || !admin) return null;

  if (isLoading || !analytics) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-secondary/30 w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-secondary/30"></div>)}
          </div>
          <div className="h-96 bg-secondary/30 w-full"></div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `$${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign },
    { title: "Total Orders", value: analytics.totalOrders, icon: ShoppingCart },
    { title: "Active Customers", value: analytics.totalCustomers, icon: Users },
    { title: "Total Products", value: analytics.totalProducts, icon: Package },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Overview</h1>
        <p className="text-muted-foreground font-sans normal-case">Monitor store performance and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <Card key={i} className="bg-secondary/10 border-border rounded-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <Card className="col-span-1 lg:col-span-2 bg-secondary/10 border-border rounded-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                    contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '0'}}
                  />
                  <Bar dataKey="revenue" fill="#fff" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-border rounded-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.ordersByStatus.map((status, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">{status.status.replace('_', ' ')}</span>
                  <span className="font-bold">{status.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 bg-secondary/10 border-border rounded-none">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 pb-2 border-b border-border/50 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-right">Units Sold</div>
                <div className="col-span-3 text-right">Revenue</div>
              </div>
              {analytics.topProducts.map((product, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 font-bold text-sm uppercase tracking-wide truncate">{product.productName}</div>
                  <div className="col-span-3 text-right text-sm">{product.totalSold}</div>
                  <div className="col-span-3 text-right text-sm font-bold">${product.revenue.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </AdminLayout>
  );
}
