import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingCart, Minus, Plus, CheckCircle, Package, Clock } from "lucide-react";
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

  useEffect(() => {
    if (slug && productId) loadProduct();
  }, [slug, productId]);

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
      for (let i = 0; i < quantity; i++) {
        addItem({
          productId: product._id,
          name: product.name,
          price: product.discountPrice || product.originalPrice,
          originalPrice: product.originalPrice,
          unit: product.unit,
          image: product.images?.[0]?.url,
        });
      }
    }
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-muted-foreground">Product not found</span></div>;
  }

  const price = product.discountPrice || product.originalPrice;
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-primary font-bold text-lg">MyStoreLink</h1>
        <button onClick={() => navigate(`/catalog/${slug}/checkout`)} className="relative">
          <ShoppingCart size={22} />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Product Image */}
      <div className="mx-4 h-72 rounded-xl overflow-hidden relative bg-secondary">
        {product.images?.[0]?.url ? (
          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-6xl">🛒</div>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.category || "Premium Grains"}</span>
            {product.inStock !== false && (
              <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success rounded-full" /> In Stock
              </span>
            )}
            {product.unit && <span className="text-[10px] text-muted-foreground">Unit: {product.unit}</span>}
          </div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">₹{price}</span>
          {product.discountPrice && (
            <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
          )}
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
          >
            <Minus size={16} />
          </button>
          <span className="text-lg font-bold w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add to Cart / List */}
        <Button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground h-12 text-base">
          🛒 Add to List
        </Button>

        {/* Features */}
        <div className="space-y-3 pt-4">
          {[
            { icon: CheckCircle, title: "100% Organic", desc: "Naturally aged for 12 months to enhance flavor and fluffiness." },
            { icon: Package, title: "Long Grain", desc: "Average grain length of 7.5mm, perfect for biryani and pilaf." },
            { icon: Clock, title: "Quick Cooking", desc: "Uniform cooking time for perfect results every single meal." },
          ].map((feat, i) => (
            <div key={i} className="bg-card rounded-xl p-4 flex gap-3">
              <feat.icon className="text-primary flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-semibold">{feat.title}</p>
                <p className="text-xs text-muted-foreground">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 pt-6">
          <p className="text-sm font-bold">MyStoreLink</p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Support</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Powered by MyStoreLink</p>
        </div>
      </div>
    </div>
  );
}
