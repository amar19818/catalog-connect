import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ArrowLeft, Check } from "lucide-react";
import { api } from "@/lib/api";
import { STORE_THEMES } from "@/lib/themes";
import { toast } from "sonner";

export default function CreateStorePage() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [description, setDescription] = useState("");
  const [themeId, setThemeId] = useState("theme-orange");
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
      await api.stores.create({ storeName, whatsappNumber, description, bannerImage, themeId });
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
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold">Build Your Storefront</h1>
            <p className="text-xs text-muted-foreground">Set up your online store in minutes</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Banner Upload */}
          <label className="block cursor-pointer group">
            <div className={`h-40 rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 overflow-hidden transition-colors group-hover:border-primary/50 ${bannerPreview ? "" : "bg-card"}`}>
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Camera className="text-primary" size={22} />
                  </div>
                  <span className="text-xs text-muted-foreground">Upload Store Banner</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
          </label>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Store Name</Label>
            <Input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="e.g. Ramu Kirana" className="bg-card border-border/50 rounded-xl h-11" required />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">WhatsApp Number</Label>
            <Input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="919876543210" className="bg-card border-border/50 rounded-xl h-11" required />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell your story..." className="bg-card border-border/50 rounded-xl resize-none h-20" />
          </div>

          {/* Theme Selector */}
          <div className="space-y-3">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Store Theme</Label>
            <div className="grid grid-cols-4 gap-2">
              {STORE_THEMES.map(theme => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    themeId === theme.id
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-border/30 bg-card hover:border-border"
                  }`}
                >
                  {themeId === theme.id && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check size={10} className="text-primary-foreground" />
                    </span>
                  )}
                  <div
                    className="w-8 h-8 rounded-full shadow-inner"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <span className="text-[9px] font-medium text-center leading-tight">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slug Preview */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Your Store Link</Label>
            <div className="bg-card rounded-xl px-4 py-3 flex items-center gap-1 border border-border/30">
              <span className="text-sm text-muted-foreground">mystorelink.com/</span>
              <span className="text-sm text-primary font-semibold">{slug || "your-store"}</span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground h-12 text-base rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : "Launch Your Store 🚀"}
          </Button>
        </form>
      </div>
    </div>
  );
}
