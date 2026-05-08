import { AdminLayout } from "@/components/admin-layout";
import { useListProducts, useDeleteProduct, getListProductsQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminProducts() {
  const { admin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!admin && !authLoading) {
      setLocation("/admin/login");
    }
  }, [admin, authLoading, setLocation]);

  const { data: products, isLoading } = useListProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct.mutateAsync({ id });
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (authLoading || !admin) return null;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Products</h1>
          <p className="text-muted-foreground font-sans normal-case">Manage your product catalog.</p>
        </div>
        <Button className="bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold" asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-secondary/10 border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Product</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Price</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Stock</TableHead>
              <TableHead className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Status</TableHead>
              <TableHead className="text-right uppercase tracking-widest text-xs font-bold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Loading products...</TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No products found. Create one to get started.</TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id} className="border-border border-b hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary flex-shrink-0">
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <div className="font-bold uppercase tracking-wide text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground font-sans normal-case">{product.categoryName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {product.isFeatured && <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Featured</span>}
                      {product.isBestSeller && <span className="bg-white/10 text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Best</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-white/10" asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-destructive/20 hover:text-destructive" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
