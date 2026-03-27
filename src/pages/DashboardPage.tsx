import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { LayoutDashboard, Package, ShoppingCart, Settings, Plus, Pencil, Share2, TrendingUp, ExternalLink, LogOut, Copy } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storesRes = await api.stores.getAll();
      if (storesRes.stores.length > 0) {
        const s = storesRes.stores[0];
        setStore(s);
        const prodsRes = await api.products.getByStore(s._id);
        setProducts(prodsRes.products);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <span className="text-6xl block">🏪</span>
          <h2 className="text-2xl font-extrabold">Welcome, {user?.username}!</h2>
          <p className="text-muted-foreground text-sm">Create your first store to start selling</p>
          <button onClick={() => navigate("/create-store")} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all">
            Create Store →
          </button>
        </div>
      </div>
    );
  }

  const catalogUrl = `${window.location.origin}/catalog/${store.storeSlug}`;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-primary font-extrabold text-lg tracking-tight">MyStoreLink</h1>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Logout">
              <LogOut size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-primary">{user?.username?.[0]?.toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-6 mt-6">
        {/* Welcome */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Welcome back</p>
          <h2 className="text-2xl font-extrabold">{store.storeName}</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 space-y-1 border border-border/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Products</p>
            <span className="text-3xl font-extrabold">{products.length}</span>
            <p className="text-[10px] text-muted-foreground">Active items</p>
          </div>
          <div className="bg-card rounded-2xl p-4 space-y-1 border border-border/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">In Stock</p>
            <span className="text-3xl font-extrabold text-success">{products.filter(p => p.inStock !== false).length}</span>
            <p className="text-[10px] text-muted-foreground">Available</p>
          </div>
          <div className="bg-card rounded-2xl p-4 space-y-1 border border-border/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Out of Stock</p>
            <span className="text-3xl font-extrabold text-destructive">{products.filter(p => p.inStock === false).length}</span>
            <p className="text-[10px] text-muted-foreground">Need restock</p>
          </div>
          <div className="bg-primary/5 rounded-2xl p-4 space-y-1 border border-primary/20">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Theme</p>
            <span className="text-lg font-bold text-primary">{store.themeId?.replace("theme-", "") || "Default"}</span>
            <p className="text-[10px] text-muted-foreground capitalize">Active</p>
          </div>
        </div>

        {/* Share Link */}
        <div className="bg-card rounded-2xl p-4 border border-border/30 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Your Store Link</p>
            <a href={catalogUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="bg-secondary rounded-xl px-3 py-2.5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate mr-2">{catalogUrl}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(catalogUrl); toast.success("Link copied!"); }}
              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-bold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/add-product/${store._id}`)}
              className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-border/30 hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                <Plus size={20} className="text-primary" />
              </div>
              <span className="text-xs font-medium">Add Product</span>
            </button>
            <button
              onClick={() => navigate(`/products/${store._id}`)}
              className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-border/30 hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package size={20} className="text-primary" />
              </div>
              <span className="text-xs font-medium">Manage Products</span>
            </button>
            <button
              onClick={() => navigate(`/create-store`)}
              className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-border/30 hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                <Pencil size={20} className="text-primary" />
              </div>
              <span className="text-xs font-medium">Edit Store</span>
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(catalogUrl); toast.success("Link copied!"); }}
              className="bg-card rounded-2xl p-4 flex flex-col items-center gap-2.5 border border-border/30 hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
                <Share2 size={20} className="text-primary" />
              </div>
              <span className="text-xs font-medium">Share Store</span>
            </button>
          </div>
        </div>

        {/* Recent Products */}
        {products.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Your Products</h3>
              <button onClick={() => navigate(`/products/${store._id}`)} className="text-xs text-primary font-medium">VIEW ALL</button>
            </div>
            <div className="space-y-2.5">
              {products.slice(0, 4).map(p => (
                <div key={p._id} className="bg-card rounded-xl p-3 flex items-center gap-3 border border-border/30">
                  <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    {p.images?.[0]?.url ? (
                      <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm">🛒</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.unit || "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">₹{p.discountPrice || p.originalPrice}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.inStock !== false ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                      {p.inStock !== false ? "In Stock" : "Out"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav active="dashboard" storeId={store._id} />
    </div>
  );
}

export function BottomNav({ active, storeId }: { active: string; storeId?: string }) {
  const navigate = useNavigate();
  const items = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { id: "products", icon: Package, label: "Products", path: `/products/${storeId || ""}` },
    { id: "orders", icon: ShoppingCart, label: "Orders", path: "/dashboard" },
    { id: "settings", icon: Settings, label: "Settings", path: "/dashboard" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/50 z-20">
      <div className="flex justify-around py-2 max-w-lg mx-auto">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              active === item.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
