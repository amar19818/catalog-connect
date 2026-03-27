import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Store, Zap, Shield } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
            <Store className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">MyStoreLink</h1>
            <p className="text-xs text-muted-foreground mt-1">Create your online store in minutes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Username</Label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Your name"
                className="bg-card border-border/50 rounded-xl h-11"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-card border-border/50 rounded-xl h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] uppercase text-muted-foreground tracking-widest">Password</Label>
              {isLogin && (
                <button type="button" className="text-[10px] text-primary hover:underline font-medium">Forgot?</button>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-card border-border/50 rounded-xl h-11 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground h-12 text-base rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Please wait...
              </span>
            ) : isLogin ? "Get Started →" : "Create Account →"}
          </Button>
        </form>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, title: "Quick Setup", desc: "Launch in 2 min" },
            { icon: Shield, title: "Secure", desc: "Your data is safe" },
          ].map((f, i) => (
            <div key={i} className="bg-card rounded-xl p-3 border border-border/30 flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <f.icon className="text-primary" size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold">{f.title}</p>
                <p className="text-[10px] text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
