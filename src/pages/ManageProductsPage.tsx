import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Search, SlidersHorizontal, ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-primary font-bold text-lg">MyStoreLink</h1>
        <div className="w-8 h-8 rounded-full bg-primary" />
      </div>

      <div className="px-4 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Inventory Management</p>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-xs text-muted-foreground">Total Stock: {products.length} Items</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search product name, SKU or category..."
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-secondary rounded-lg text-sm">
            <SlidersHorizontal size={14} /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-secondary rounded-lg text-sm">
            <ArrowUpDown size={14} /> Sort
          </button>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No products found</div>
          ) : (
            filtered.map(product => (
              <div key={product._id} className="bg-card rounded-xl overflow-hidden">
                {/* Product Image */}
                <div className="h-44 bg-secondary">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.category || "General"}</p>
                    <h3 className="font-semibold">{product.name}</h3>
                    {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">₹{product.discountPrice || product.originalPrice}</span>
                    {product.discountPrice && (
                      <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                    )}
                    {product.unit && <span className="text-xs text-muted-foreground">/ {product.unit}</span>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.inStock}
                          onCheckedChange={() => toggleStock(product._id)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className="text-xs text-muted-foreground">
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleVisibility(product._id)}
                        className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground"
                        title={product.isVisible ? "Hide" : "Show"}
                      >
                        {product.isVisible !== false ? "👁" : "🙈"}
                      </button>
                      <button
                        onClick={() => navigate(`/edit-product/${product._id}`)}
                        className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => navigate(`/add-product/${storeId}`)}
          className="w-full bg-card border border-dashed border-border rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">Add New Product</span>
        </button>
      </div>

      <BottomNav active="products" storeId={storeId} />
    </div>
  );
}
