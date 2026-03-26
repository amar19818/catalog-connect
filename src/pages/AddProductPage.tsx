import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";

export default function AddProductPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
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
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Add Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block cursor-pointer">
            <div className="h-40 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 overflow-hidden bg-secondary">
              {imagePreview ? (
                <img src={imagePreview} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="text-muted-foreground" size={28} />
                  <span className="text-xs text-muted-foreground">Upload Image</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Product Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Basmati Rice" className="bg-secondary" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Original Price (₹)</Label>
              <Input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="120" className="bg-secondary" required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">Discount Price (₹)</Label>
              <Input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} placeholder="99" className="bg-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Unit</Label>
            <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. 1kg, 500ml" className="bg-secondary" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Product description..." className="bg-secondary resize-none h-20" />
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground h-12" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
