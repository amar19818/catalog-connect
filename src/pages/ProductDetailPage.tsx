import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { getThemeById, applyThemeToElement } from "@/lib/themes";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingCart, Minus, Plus, CheckCircle, Package, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { slug, productId } = useParams();
  const navigate = useNavigate();
  const { addItem, items, updateQuantity, itemCount } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug && productId) loadProduct();
  }, [slug, productId]);

  useEffect(() => {
    if (store?.themeId && containerRef.current) {
      const theme = getThemeById(store.themeId);
      applyThemeToElement(containerRef.current, theme);
    }
  }, [store]);

  const loadProduct = async () => {
    try {
      const res = await api.catalog.getProduct(slug!, productId!);
      setProduct(res.product);
      setStore(res.store);
      const inCart = items.find(i => i.productId === productId);
      if (inCart) setQuantity(inCart.quantity);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const existingItem = items.find(i => i.productId === product._id);
    if (existingItem) {
      updateQuantity(product._id, quantity);
    } else {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.discountPrice || product.originalPrice,
        originalPrice: product.originalPrice,
        unit: product.unit,
        image: product.images?.[0]?.url,
      });
      if (quantity > 1) updateQuantity(product._id, quantity);
    }
    toast.success(`${product.name} added to cart`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">📦</span>
        <h2 className="text-xl font-bold">Product not found</h2>
      </div>
    );
  }

  const price = product.discountPrice || product.originalPrice;
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.originalPrice) * 100) : 0;

  return (
    <div ref={containerRef} className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-primary font-extrabold text-lg">MyStoreLink</h1>
          <button onClick={() => navigate(`/catalog/${slug}/checkout`)} className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Product Image */}
        <div className="mx-4 mt-4 aspect-square rounded-2xl overflow-hidden relative bg-secondary">
          {product.images?.[0]?.url ? (
            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-7xl">🛒</div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="px-4 mt-5 space-y-5">
          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{product.category || "General"}</span>
              {product.inStock !== false && (
                <span className="text-[10px] bg-success/10 text-success px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" /> In Stock
                </span>
              )}
            </div>
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-extrabold leading-tight">{product.name}</h2>
              <button onClick={handleShare} className="p-2 rounded-full hover:bg-secondary transition-colors mt-1">
                <Share2 size={18} className="text-muted-foreground" />
              </button>
            </div>
            {product.unit && <span className="text-xs text-muted-foreground mt-1 block">Unit: {product.unit}</span>}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">₹{price}</span>
            {product.discountPrice && (
              <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
            {discount > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Save ₹{product.originalPrice - product.discountPrice}</span>
            )}
          </div>

          {/* Quantity */}
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 bg-secondary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors active:scale-95"
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 bg-secondary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors active:scale-95"
              >
                <Plus size={16} />
              </button>
              <span className="text-sm text-muted-foreground ml-auto">Total: <span className="text-foreground font-bold">₹{price * quantity}</span></span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            {[
              { icon: CheckCircle, title: "Quality Guaranteed", desc: "Carefully sourced and quality checked." },
              { icon: Package, title: "Fast Delivery", desc: "Quick delivery right to your doorstep." },
              { icon: Clock, title: "Fresh Products", desc: "Always fresh, restocked regularly." },
            ].map((feat, i) => (
              <div key={i} className="bg-card rounded-xl p-3.5 flex gap-3 border border-border/30">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feat.icon className="text-primary" size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{feat.title}</p>
                  <p className="text-xs text-muted-foreground">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/50 p-4 z-20">
        <div className="max-w-lg mx-auto flex gap-3">
          <button onClick={() => navigate(`/catalog/${slug}/checkout`)} className="w-14 h-12 bg-secondary rounded-xl flex items-center justify-center relative">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{itemCount}</span>
            )}
          </button>
          <Button onClick={handleAddToCart} className="flex-1 bg-primary text-primary-foreground h-12 text-base rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all">
            Add to Cart — ₹{price * quantity}
          </Button>
        </div>
      </div>
    </div>
  );
}
