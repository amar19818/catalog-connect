import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import { getThemeById, applyThemeToElement } from "@/lib/themes";
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { items, total, clearCart, updateQuantity, removeItem } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      api.catalog.get(slug).then(res => setStore(res.store)).catch(() => {});
    }
  }, [slug]);

  useEffect(() => {
    if (store?.themeId && containerRef.current) {
      const theme = getThemeById(store.themeId);
      applyThemeToElement(containerRef.current, theme);
    }
  }, [store]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      const res = await api.catalog.order(slug!, {
        customerName,
        customerPhone,
        customerAddress,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      });
      window.open(res.whatsappUrl, "_blank");
      clearCart();
      toast.success("Order placed! Redirecting to WhatsApp...");
      navigate(`/catalog/${slug}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-primary font-extrabold text-lg">MyStoreLink</h1>
          <div className="relative p-2">
            <ShoppingCart size={22} />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Secure Checkout</p>
          <h2 className="text-2xl font-extrabold">Review Order</h2>
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl block mb-3">🛒</span>
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={() => navigate(`/catalog/${slug}`)} variant="outline" className="mt-4">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.productId} className="bg-card rounded-xl p-3 flex items-center gap-3 border border-border/30">
                <div className="w-14 h-14 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🛒</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.unit}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-6 h-6 bg-secondary rounded flex items-center justify-center">
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-6 h-6 bg-secondary rounded flex items-center justify-center">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-sm font-bold">₹{item.price * item.quantity}</span>
                  <button onClick={() => removeItem(item.productId)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <>
            {/* Total */}
            <div className="bg-card rounded-xl p-4 border border-border/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-sm font-medium">₹{total}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-muted-foreground">Delivery</span>
                <span className="text-sm text-success font-medium">FREE</span>
              </div>
              <div className="border-t border-border/30 mt-3 pt-3 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-extrabold text-primary">₹{total}</span>
              </div>
            </div>

            {/* Delivery Details */}
            <form onSubmit={handleOrder} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <h3 className="font-bold">Delivery Details</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Your Name</Label>
                <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Your full name" className="bg-card border-border/50 rounded-xl h-11" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Phone Number</Label>
                <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+91 98765 43210" className="bg-card border-border/50 rounded-xl h-11" required />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Delivery Address</Label>
                <Input value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="Street, Landmark, City..." className="bg-card border-border/50 rounded-xl h-11" required />
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground h-13 text-base rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all" disabled={loading}>
                <MessageSquare size={18} />
                {loading ? "Placing Order..." : "Order on WhatsApp"}
              </Button>

              <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
                No payment now • Pay on delivery
              </p>
            </form>
          </>
        )}

        {/* Footer */}
        <div className="text-center py-4 border-t border-border/30">
          <p className="text-sm font-bold text-primary">MyStoreLink</p>
          <p className="text-[10px] text-muted-foreground mt-1">Powered by MyStoreLink</p>
        </div>
      </div>
    </div>
  );
}
