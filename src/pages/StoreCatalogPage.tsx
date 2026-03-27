import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { getThemeById, applyThemeToElement } from "@/lib/themes";
import { useCart } from "@/contexts/CartContext";
import { Search, ShoppingCart, Home, User, Star, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function StoreCatalogPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) loadCatalog();
  }, [slug]);

  // Apply store theme
  useEffect(() => {
    if (store?.themeId && containerRef.current) {
      const theme = getThemeById(store.themeId);
      applyThemeToElement(containerRef.current, theme);
    }
  }, [store]);

  const loadCatalog = async () => {
    try {
      const res = await api.catalog.get(slug!);
      setStore(res.store);
      setProducts(res.products);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (product: any) => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.discountPrice || product.originalPrice,
      originalPrice: product.originalPrice,
      unit: product.unit,
      image: product.images?.[0]?.url,
    });
    toast.success(`${product.name} added to cart`);
  };

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category || "General")))];
  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => activeCategory === "All" || (p.category || "General") === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">Loading store...</span>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🏪</span>
        <h2 className="text-xl font-bold">Store not found</h2>
        <p className="text-muted-foreground text-sm">This store doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-primary font-extrabold text-lg tracking-tight">MyStoreLink</h1>
          <button onClick={() => navigate(`/catalog/${slug}/checkout`)} className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Banner */}
        {store.bannerImage ? (
          <div className="mx-4 mt-4 h-48 rounded-2xl overflow-hidden relative group">
            <img src={store.bannerImage} alt={store.storeName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full backdrop-blur-sm font-medium">OPEN NOW</span>
                <span className="flex items-center gap-0.5 text-[10px] text-primary">
                  <Star size={10} className="fill-primary" /> 4.8
                </span>
              </div>
              <h2 className="text-2xl font-extrabold">{store.storeName}</h2>
              {store.description && <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{store.description}</p>}
            </div>
          </div>
        ) : (
          <div className="mx-4 mt-4 bg-gradient-to-br from-primary/10 via-card to-card rounded-2xl p-6 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-medium">OPEN NOW</span>
              <span className="flex items-center gap-0.5 text-[10px] text-primary">
                <Star size={10} className="fill-primary" /> 4.8
              </span>
            </div>
            <h2 className="text-2xl font-extrabold">{store.storeName}</h2>
            {store.description && <p className="text-sm text-muted-foreground mt-1">{store.description}</p>}
            <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
              <MapPin size={12} />
              <span>Online Store</span>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="pl-10 bg-card border-border/50 rounded-xl h-11"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-3">
          {filtered.map(product => (
            <div key={product._id} className="bg-card rounded-2xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all duration-300 group">
              <button onClick={() => navigate(`/catalog/${slug}/product/${product._id}`)} className="w-full text-left">
                <div className="aspect-square bg-secondary relative overflow-hidden">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl">🛒</div>
                  )}
                  {product.discountPrice && (
                    <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {Math.round((1 - product.discountPrice / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                  {product.inStock !== false && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-success rounded-full shadow-lg shadow-success/50" />
                  )}
                </div>
              </button>

              <div className="p-3 space-y-2">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">{product.category || "General"}</p>
                  <h3 className="font-semibold text-sm leading-tight line-clamp-1">{product.name}</h3>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold">₹{product.discountPrice || product.originalPrice}</span>
                  {product.discountPrice && (
                    <span className="text-[11px] text-muted-foreground line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
                >
                  <ShoppingCart size={13} /> ADD
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="text-muted-foreground text-sm">No products found</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 mt-8 border-t border-border/30 mx-4">
          <p className="text-sm font-bold text-primary">MyStoreLink</p>
          <p className="text-[10px] text-muted-foreground mt-1">Powered by MyStoreLink</p>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/50 z-20">
        <div className="flex justify-around py-2.5 max-w-lg mx-auto">
          {[
            { icon: Home, label: "Home", active: true, action: () => {} },
            { icon: Search, label: "Search", action: () => document.querySelector<HTMLInputElement>("input")?.focus() },
            { icon: ShoppingCart, label: "Cart", badge: itemCount, action: () => navigate(`/catalog/${slug}/checkout`) },
            { icon: User, label: "Account", action: () => {} },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 relative transition-colors ${item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <item.icon size={20} />
              {item.badge ? (
                <span className="absolute -top-0.5 right-2 bg-primary text-primary-foreground text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              ) : null}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
