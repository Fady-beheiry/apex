import { AdminLayout } from "@/components/admin-layout";
import { useListBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, getListBannersQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminBanners() {
  const { admin, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!admin && !authLoading) {
      setLocation("/admin/login");
    }
  }, [admin, authLoading, setLocation]);

  const { data: banners, isLoading } = useListBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    isActive: true,
    sortOrder: "0"
  });

  const handleEdit = (banner: any) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      isActive: banner.isActive,
      sortOrder: banner.sortOrder.toString()
    });
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "",
      isActive: true,
      sortOrder: "0"
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl || null,
      isActive: formData.isActive,
      sortOrder: parseInt(formData.sortOrder)
    };

    try {
      if (editingId) {
        await updateBanner.mutateAsync({ id: editingId, data });
        toast.success("Banner updated");
      } else {
        await createBanner.mutateAsync({ data });
        toast.success("Banner created");
      }
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: getListBannersQueryKey() });
    } catch (error) {
      toast.error("Failed to save banner");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner.mutateAsync({ id });
      toast.success("Banner deleted");
      queryClient.invalidateQueries({ queryKey: getListBannersQueryKey() });
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  if (authLoading || !admin) return null;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Banners</h1>
          <p className="text-muted-foreground font-sans normal-case">Manage homepage carousel banners.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" /> Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-border bg-background rounded-none">
            <DialogHeader>
              <DialogTitle className="uppercase tracking-widest font-bold">{editingId ? "Edit Banner" : "New Banner"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Title *</Label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-secondary/30 rounded-none border-border" />
              </div>
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Subtitle</Label>
                <Input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="bg-secondary/30 rounded-none border-border" />
              </div>
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Image URL *</Label>
                <Input required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="bg-secondary/30 rounded-none border-border" />
              </div>
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Link URL</Label>
                <Input value={formData.linkUrl} onChange={e => setFormData({...formData, linkUrl: e.target.value})} className="bg-secondary/30 rounded-none border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-xs font-bold text-muted-foreground">Sort Order</Label>
                  <Input type="number" required value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: e.target.value})} className="bg-secondary/30 rounded-none border-border" />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch id="active" checked={formData.isActive} onCheckedChange={c => setFormData({...formData, isActive: c})} />
                  <Label htmlFor="active" className="uppercase tracking-widest text-xs font-bold">Active</Label>
                </div>
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest font-bold mt-6">
                {editingId ? "Update" : "Save"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners?.map(banner => (
            <div key={banner.id} className="bg-secondary/10 border border-border group">
              <div className="aspect-video relative overflow-hidden bg-secondary">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!banner.isActive && 'opacity-50 grayscale'}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground">NO IMAGE</div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button variant="secondary" size="icon" className="h-8 w-8 rounded-none bg-black/50 hover:bg-black text-white border-none" onClick={() => handleEdit(banner)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8 rounded-none bg-destructive/80 hover:bg-destructive text-white border-none" onClick={() => handleDelete(banner.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold uppercase tracking-wide text-sm">{banner.title}</h3>
                  {!banner.isActive && <span className="text-[10px] uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 font-bold">Inactive</span>}
                </div>
                <p className="text-xs text-muted-foreground font-sans normal-case mb-2">{banner.subtitle}</p>
                <div className="text-xs font-mono text-muted-foreground">Order: {banner.sortOrder}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
