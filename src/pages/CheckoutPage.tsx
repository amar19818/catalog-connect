import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [loading, setLoading] = useState(false);

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
      // Open WhatsApp
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-sm mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-primary font-bold text-lg">MyStoreLink</h1>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} />
            <ShoppingCart size={18} />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Secure Checkout</p>
          <h2 className="text-2xl font-bold">Review Order</h2>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-3 border-t border-border">
          <span className="text-sm text-muted-foreground uppercase">Total Amount</span>
          <span className="text-2xl font-bold text-primary">₹{total}</span>
        </div>

        {/* Delivery Details */}
        <form onSubmit={handleOrder} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <h3 className="font-semibold">Delivery Details</h3>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Your Name</Label>
            <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="John Doe" className="bg-secondary" required />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Phone Number</Label>
            <Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+91 98765 43210" className="bg-secondary" required />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground">Delivery Address</Label>
            <Input value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="Street, Landmark, Apartment number..." className="bg-secondary" required />
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground h-12 text-base flex items-center gap-2" disabled={loading}>
            <span>💬</span> {loading ? "Placing Order..." : "Order on WhatsApp"}
          </Button>

          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wider">
            No payment required now. Pay on delivery.
          </p>
        </form>

        {/* Footer */}
        <div className="text-center space-y-2 pt-4">
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
