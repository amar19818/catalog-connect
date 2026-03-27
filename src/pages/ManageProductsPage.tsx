import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Search, SlidersHorizontal, ArrowUpDown, Plus, Pencil, Trash2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { BottomNav } from "./DashboardPage";

export default function ManageProductsPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "instock" | "outofstock">("all");

  useEffect(() => {
    if (storeId) loadProducts();
  }, [storeId]);

  const loadProducts = async () => {
    try {
      const res = await api.products.getByStore(storeId!);
      setProducts(res.products);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStock = async (productId: string) => {
    try {
      const res = await api.products.toggleStock(productId);
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, inStock: res.inStock } : p));
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const toggleVisibility = async (productId: string) => {
    try {
      const res = await api.products.toggleVisibility(productId);
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, isVisible: res.isVisible } : p));
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.products.delete(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success("Product deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => {
      if (filter === "instock") return p.inStock !== false;
      if (filter === "outofstock") return p.inStock === false;
      return true;
    });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-extrabold">Products</h1>
              <p className="text-[10px] text-muted-foreground">{products.length} total items</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/add-product/${storeId}`)}
            className="bg-primary text-primary-foreground px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4 mt-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-10 bg-card border-border/50 rounded-xl h-11"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { id: "all" as const, label: "All" },
            { id: "instock" as const, label: "In Stock" },
            { id: "outofstock" as const, label: "Out of Stock" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card text-muted-foreground border border-border/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">📦</span>
            <p className="text-muted-foreground text-sm">No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(product => (
              <div key={product._id} className="bg-card rounded-2xl overflow-hidden border border-border/30 hover:border-primary/20 transition-all">
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">🛒</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase">{product.category || "General"}</p>
                        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        product.inStock !== false ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      }`}>
                        {product.inStock !== false ? "In Stock" : "Out"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-base font-bold text-primary">₹{product.discountPrice || product.originalPrice}</span>
                      {product.discountPrice && (
                        <span className="text-[11px] text-muted-foreground line-through">₹{product.originalPrice}</span>
                      )}
                      {product.unit && <span className="text-[10px] text-muted-foreground ml-1">/ {product.unit}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions bar */}
                <div className="px-3 py-2.5 bg-secondary/30 border-t border-border/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.inStock}
                      onCheckedChange={() => toggleStock(product._id)}
                      className="data-[state=checked]:bg-success scale-90"
                    />
                    <span className="text-[10px] text-muted-foreground">Stock</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleVisibility(product._id)}
                      className="w-8 h-8 bg-card rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      title={product.isVisible !== false ? "Hide" : "Show"}
                    >
                      {product.isVisible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="w-8 h-8 bg-card rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="products" storeId={storeId} />
    </div>
  );
}
