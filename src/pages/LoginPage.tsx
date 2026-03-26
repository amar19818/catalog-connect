import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MessageCircle } from "lucide-react";
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
      toast.success(isLogin ? "Login successful!" : "Account created!");
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
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">MyStoreLink</h1>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setIsLogin(true)}
              className={`text-lg font-semibold pb-1 ${isLogin ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`text-lg font-semibold pb-1 ${!isLogin ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground tracking-wider">Username</Label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Your name"
                className="bg-secondary border-border"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground tracking-wider">Store Owner Email</Label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="owner@store.com"
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs uppercase text-muted-foreground tracking-wider">Access Password</Label>
              {isLogin && (
                <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-secondary border-border pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary text-primary-foreground h-12 text-base" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Get Started →" : "Create Account →"}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground">Or continue with enterprise SSO</p>
          <div className="flex justify-center gap-3">
            <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm">G</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm">🍎</span>
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            By continuing, you agree to our Terms of Conditions & Privacy Policy
          </p>
        </div>

        <button className="fixed bottom-6 right-6 bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
          <MessageCircle size={20} />
        </button>
      </div>
    </div>
  );
}
