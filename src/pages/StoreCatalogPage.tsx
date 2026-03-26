import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { Search, ShoppingCart, Home, User } from "lucide-react";
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

  useEffect(() => {
    if (slug) loadCatalog();
  }, [slug]);

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

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-muted-foreground">Loading...</span></div>;
  }

  if (!store) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-muted-foreground">Store not found</span></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
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

      {/* Banner */}
      {store.bannerImage && (
        <div className="mx-4 h-44 rounded-xl overflow-hidden relative">
          <img src={store.bannerImage} alt={store.storeName} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-xs text-muted-foreground">EST. {new Date().getFullYear()}</p>
            <h2 className="text-2xl font-bold">{store.storeName}</h2>
            <p className="text-sm text-muted-foreground">{store.description}</p>
          </div>
        </div>
      )}

      {!store.bannerImage && (
        <div className="mx-4 bg-card rounded-xl p-6">
          <h2 className="text-2xl font-bold">{store.storeName}</h2>
          <p className="text-sm text-muted-foreground mt-1">{store.description}</p>
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
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Products */}
      <div className="px-4 mt-4 space-y-4">
        {filtered.map(product => (
          <div key={product._id} className="bg-card rounded-xl overflow-hidden">
            <button onClick={() => navigate(`/catalog/${slug}/product/${product._id}`)} className="w-full text-left">
              <div className="h-48 bg-secondary">
                {product.images?.[0]?.url ? (
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl">🛒</div>
                )}
                {product.discountPrice && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold">SALE</span>
                  </div>
                )}
              </div>
            </button>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">{product.category || "General"}</p>
                  <h3 className="font-semibold">{product.name}</h3>
                </div>
                {product.inStock !== false && (
                  <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-success rounded-full" /> In Stock
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">₹{product.discountPrice || product.originalPrice}</span>
                {product.discountPrice && (
                  <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                )}
              </div>

              <button
                onClick={() => handleAdd(product)}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                🛒 ADD
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around py-2 max-w-md mx-auto">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: Search, label: "Search" },
            { icon: ShoppingCart, label: "Cart", badge: itemCount },
            { icon: User, label: "Account" },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => item.label === "Cart" && navigate(`/catalog/${slug}/checkout`)}
              className={`flex flex-col items-center gap-1 px-3 py-1 relative ${item.active ? "text-primary" : "text-muted-foreground"}`}
            >
              <item.icon size={20} />
              {item.badge ? (
                <span className="absolute -top-0.5 right-1 bg-primary text-primary-foreground text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
