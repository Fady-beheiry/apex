import { AdminLayout } from "@/components/admin-layout";
import { 
  useGetProduct, 
  useCreateProduct, 
  useUpdateProduct, 
  useListCategories,
  getGetProductQueryKey,
  getListProductsQueryKey
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useLocation, useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminProductForm() {
  const { admin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [matchNew] = useRoute("/admin/products/new");
  const [matchEdit, params] = useRoute("/admin/products/:id/edit");
  const queryClient = useQueryClient();
  
  const isEdit = !!matchEdit;
  const id = Number(params?.id);

  useEffect(() => {
    if (!admin && !authLoading) {
      setLocation("/admin/login");
    }
  }, [admin, authLoading, setLocation]);

  const { data: categories } = useListCategories();
  const { data: product, isLoading: productLoading } = useGetProduct(id, {
    query: { enabled: isEdit && !!id, queryKey: getGetProductQueryKey(id) }
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    imageUrl: "",
    categoryId: "none",
    stock: "100",
    sku: "",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    sizes: "XS,S,M,L,XL,XXL",
    colors: "Black,White,Grey,Navy",
  });

  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() || "",
        imageUrl: product.imageUrl,
        categoryId: product.categoryId?.toString() || "none",
        stock: product.stock.toString(),
        sku: product.sku || "",
        isFeatured: product.isFeatured,
        isBestSeller: product.isBestSeller,
        isNewArrival: product.isNewArrival,
        sizes: product.sizes?.join(",") || "",
        colors: product.colors?.join(",") || "",
      });
    }
  }, [isEdit, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
      imageUrl: formData.imageUrl,
      categoryId: formData.categoryId !== "none" ? parseInt(formData.categoryId) : null,
      stock: parseInt(formData.stock),
      sku: formData.sku || null,
      isFeatured: formData.isFeatured,
      isBestSeller: formData.isBestSeller,
      isNewArrival: formData.isNewArrival,
      sizes: formData.sizes ? formData.sizes.split(",").map(s => s.trim()) : [],
      colors: formData.colors ? formData.colors.split(",").map(c => c.trim()) : [],
    };

    try {
      if (isEdit) {
        await updateProduct.mutateAsync({ id, data });
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync({ data });
        toast.success("Product created successfully");
      }
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      setLocation("/admin/products");
    } catch (error) {
      toast.error(isEdit ? "Failed to update product" : "Failed to create product");
    }
  };

  if (authLoading || !admin || (isEdit && productLoading)) return null;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
          {isEdit ? "Edit Product" : "New Product"}
        </h1>
        <p className="text-muted-foreground font-sans normal-case">Configure product details.</p>
      </div>

      <div className="max-w-4xl bg-secondary/10 border border-border p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Name *</Label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background rounded-none border-border" />
            </div>
            <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Category</Label>
              <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v})}>
                <SelectTrigger className="bg-background rounded-none border-border">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-border">
                  <SelectItem value="none">None</SelectItem>
                  {categories?.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Description *</Label>
            <Textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background rounded-none border-border resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Price *</Label>
              <Input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-background rounded-none border-border" />
            </div>
            <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Compare at Price</Label>
              <Input type="number" step="0.01" value={formData.comparePrice} onChange={e => setFormData({...formData, comparePrice: e.target.value})} className="bg-background rounded-none border-border" />
            </div>
            <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Stock *</Label>
              <Input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="bg-background rounded-none border-border" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">SKU</Label>
              <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="bg-background rounded-none border-border" />
            </div>
            <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Main Image URL *</Label>
              <Input required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="bg-background rounded-none border-border" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Sizes (comma separated)</Label>
              <Input value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="bg-background rounded-none border-border" />
            </div>
            <div className="space-y-2">
              <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Colors (comma separated)</Label>
              <Input value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} className="bg-background rounded-none border-border" />
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <h3 className="uppercase tracking-widest font-bold text-sm">Product Status</h3>
            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={formData.isFeatured} onCheckedChange={c => setFormData({...formData, isFeatured: c})} />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="bestseller" checked={formData.isBestSeller} onCheckedChange={c => setFormData({...formData, isBestSeller: c})} />
                <Label htmlFor="bestseller">Best Seller</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="newarrival" checked={formData.isNewArrival} onCheckedChange={c => setFormData({...formData, isNewArrival: c})} />
                <Label htmlFor="newarrival">New Arrival</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-border">
            <Button type="button" variant="outline" className="rounded-none uppercase tracking-widest font-bold" onClick={() => setLocation("/admin/products")}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending} className="bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold">
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
