import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShieldCheck, User } from "lucide-react";
import retailBotLogo from "@/assets/retailbot-logo.png";

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent! Check your email.");
      setForgotMode(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, role);
      toast.success("Account created! You may need to verify your email.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <img src={retailBotLogo} alt="RetailBot Logo" width={96} height={96} className="mx-auto mb-3" />
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            RetailBot
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-Powered Electronics Shopping Assistant
          </p>
        </div>
        <Card className="shadow-elevated border-border">
          <Tabs defaultValue="login">
            <CardHeader className="pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>
            <TabsContent value="login">
              {forgotMode ? (
                <form onSubmit={handleForgotPassword}>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">Enter your email to receive a password reset link.</p>
                    <Input placeholder="Email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                    <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => setForgotMode(false)}>
                      Back to Login
                    </button>
                  </CardContent>
                </form>
              ) : (
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                    <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => setForgotMode(true)}>
                      Forgot Password?
                    </button>
                  </CardContent>
                </form>
              )}
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Input placeholder="Password (min 6 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Select Role</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setRole("customer")}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${role === "customer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <User className={`h-6 w-6 ${role === "customer" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">Customer</span>
                      </button>
                      <button type="button" onClick={() => setRole("admin")}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${role === "admin" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <ShieldCheck className={`h-6 w-6 ${role === "admin" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-sm font-medium">Admin</span>
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
