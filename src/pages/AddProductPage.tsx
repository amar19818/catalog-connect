import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AddProductPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let images: any[] = [];
      if (imageFile) {
        const uploadRes = await api.upload.single(imageFile, "products");
        images = [{ url: uploadRes.url, fileId: uploadRes.fileId }];
      }
      await api.products.create({
        storeId,
        name,
        originalPrice: Number(originalPrice),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        unit,
        description,
        category,
        images,
      });
      toast.success("Product added!");
      navigate(`/products/${storeId}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold">Add Product</h1>
            <p className="text-xs text-muted-foreground">Add a new item to your store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <label className="block cursor-pointer group">
            <div className="h-44 rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 overflow-hidden transition-colors group-hover:border-primary/50 bg-card">
              {imagePreview ? (
                <img src={imagePreview} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Camera className="text-primary" size={22} />
                  </div>
                  <span className="text-xs text-muted-foreground">Upload Product Image</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Product Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Basmati Rice" className="bg-card border-border/50 rounded-xl h-11" required />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Category</Label>
            <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Grains, Dairy, Fruits" className="bg-card border-border/50 rounded-xl h-11" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Price (₹)</Label>
              <Input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="120" className="bg-card border-border/50 rounded-xl h-11" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Sale Price (₹)</Label>
              <Input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} placeholder="99" className="bg-card border-border/50 rounded-xl h-11" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Unit</Label>
            <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. 1kg, 500ml, dozen" className="bg-card border-border/50 rounded-xl h-11" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Product description..." className="bg-card border-border/50 rounded-xl resize-none h-20" />
          </div>

          {discountPrice && Number(discountPrice) < Number(originalPrice) && (
            <div className="bg-success/5 border border-success/20 rounded-xl p-3 text-xs text-success flex items-center gap-2">
              <span className="text-lg">🏷️</span>
              Discount: {Math.round((1 - Number(discountPrice) / Number(originalPrice)) * 100)}% off — Customers save ₹{Number(originalPrice) - Number(discountPrice)}
            </div>
          )}

          <Button type="submit" className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus size={18} /> Add Product
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
