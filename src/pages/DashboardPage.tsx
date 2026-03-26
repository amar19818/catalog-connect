import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { LayoutDashboard, Package, ShoppingCart, Settings, Plus, Pencil, Share2, TrendingUp } from "lucide-react";
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

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">No store yet</h2>
          <p className="text-muted-foreground">Create your first store to get started</p>
          <button onClick={() => navigate("/create-store")} className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
            Create Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-primary font-bold text-lg">MyStoreLink</h1>
        <button onClick={() => navigate("/settings")} className="w-8 h-8 rounded-full bg-secondary overflow-hidden">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs flex items-center justify-center h-full">{user?.username?.[0]?.toUpperCase()}</span>
          )}
        </button>
      </div>

      <div className="px-4 space-y-6">
        {/* Operational Overview */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Operational Overview</p>
          <h2 className="text-2xl font-bold">Store <em className="text-primary not-italic">Intelligence</em></h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase">Total Orders</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">1,284</span>
              <span className="text-xs text-success mb-1">+12%</span>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 space-y-1 flex items-center justify-center">
            <TrendingUp className="text-primary" size={40} />
          </div>
          <div className="bg-card rounded-xl p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase">Store Views</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">42.5k</span>
              <span className="text-xs text-success mb-1">+5.2k</span>
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-1">
            <p className="text-xs text-muted-foreground uppercase">Revenue</p>
            <span className="text-2xl font-bold text-primary">$14,290</span>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate(`/products/${store._id}`)}
              className="bg-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="text-xs">Add Product</span>
            </button>
            <button
              onClick={() => navigate(`/create-store`)}
              className="bg-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Pencil size={20} />
              </div>
              <span className="text-xs">Edit Store</span>
            </button>
          </div>
        </div>

        {/* Share Link */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/catalog/${store.storeSlug}`);
            toast.success("Link copied!");
          }}
          className="w-full flex items-center gap-2 justify-center py-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <Share2 size={16} />
          <span>Share Link</span>
          <span className="text-xs text-primary">mystorelink.me/{store.storeSlug}</span>
        </button>

        {/* Campaign Banner */}
        {store.bannerImage && (
          <div className="rounded-xl overflow-hidden h-32 relative">
            <img src={store.bannerImage} alt="Campaign" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
              <div>
                <p className="text-xs text-muted-foreground">Safe seamless work</p>
                <p className="font-semibold">Active Campaign</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Recent Orders</h3>
            <button className="text-xs text-primary">VIEW ALL</button>
          </div>
          <div className="space-y-3">
            {products.slice(0, 3).map((p, i) => (
              <div key={p._id} className="bg-card rounded-xl p-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                  {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">#{String(i + 1).padStart(4, "0")}</p>
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Customer: Demo User</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">₹{p.discountPrice || p.originalPrice}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {["PROCESSING", "SHIPPED", "DELIVERED"][i % 3]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around py-2 max-w-md mx-auto">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              active === item.id ? "text-primary bg-primary/10" : "text-muted-foreground"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
