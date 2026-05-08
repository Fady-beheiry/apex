import { AdminLayout } from "@/components/admin-layout";
import { useListOrders, useUpdateOrderStatus, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminOrders() {
  const { admin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!admin && !authLoading) {
      setLocation("/admin/login");
    }
  }, [admin, authLoading, setLocation]);

  const { data: orders, isLoading } = useListOrders({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (id: number, status: any) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      toast.success(`Order status updated to ${status}`);
      queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (authLoading || !admin) return null;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Orders</h1>
        <p className="text-muted-foreground font-sans normal-case">Manage and track customer orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-border rounded-none"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background rounded-none border-border">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border">
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="on_the_way">On the Way</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-secondary/10 border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Order ID</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Date</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Customer</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Total</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading orders...</TableCell>
              </TableRow>
            ) : orders?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No orders found.</TableCell>
              </TableRow>
            ) : (
              orders?.map((order) => (
                <TableRow key={order.id} className="border-border border-b hover:bg-white/5 transition-colors">
                  <TableCell className="font-bold font-mono">{order.orderNumber}</TableCell>
                  <TableCell className="text-muted-foreground font-sans normal-case text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="font-bold uppercase tracking-wide text-sm">{order.fullName}</div>
                    <div className="text-xs text-muted-foreground font-sans normal-case">{order.city}</div>
                  </TableCell>
                  <TableCell className="font-bold">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                      <SelectTrigger className="w-[140px] h-8 text-xs font-bold uppercase tracking-widest rounded-none border-border bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-border text-xs uppercase tracking-widest font-bold">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="on_the_way">On the Way</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
