import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, QrCode, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function CreateStorePage() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [description, setDescription] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let bannerImage = "";
      if (bannerFile) {
        const uploadRes = await api.upload.single(bannerFile, "banners");
        bannerImage = uploadRes.url;
      }
      const res = await api.stores.create({ storeName, whatsappNumber, description, bannerImage });
      toast.success("Store created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-primary font-bold text-lg">MyStoreLink</h1>
          <QrCode className="text-muted-foreground" size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold">Build Your Storefront</h2>
          <p className="text-sm text-muted-foreground">Enter your details to launch your professional dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Banner Upload */}
          <label className="block cursor-pointer">
            <div className={`h-40 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 overflow-hidden ${bannerPreview ? "" : "bg-secondary"}`}>
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="text-muted-foreground" size={28} />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Upload Store Banner</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </label>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground tracking-wider">Store Name</Label>
            <Input
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              placeholder="e.g. Ravi Curator"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground tracking-wider">WhatsApp Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">📞</span>
              <Input
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                placeholder="+1 555 000 000"
                className="bg-secondary border-border pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground tracking-wider">Store Description</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell your Story..."
              className="bg-secondary border-border resize-none h-20"
            />
          </div>

          {/* Unique Link Preview */}
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground tracking-wider">Your Unique Link</Label>
            <div className="bg-secondary rounded-lg px-4 py-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">mystorelink.com/</span>
              <span className="text-sm text-primary font-medium">{slug || "your-store"}</span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground h-12 text-base" disabled={loading}>
            {loading ? "Creating..." : "Launch Your Store 🚀"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-primary hover:underline">Log in</button>
          </p>
        </form>

        <button className="fixed bottom-6 right-6 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
          <MessageCircle size={20} />
        </button>
      </div>
    </div>
  );
}
