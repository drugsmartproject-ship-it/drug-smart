import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Pill, Hash, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [pharmacyId, setPharmacyId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/app/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pharmacyId.trim()) { setError("Please enter your Pharmacy ID"); return; }
    if (!email.trim()) { setError("Please enter your email address"); return; }
    if (!password) { setError("Please enter your password"); return; }

    setIsLoading(true);
    try {
      await login(pharmacyId.trim().toUpperCase(), email.trim(), password);
      toast({ title: "Welcome back!", description: "Logged in successfully." });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/10 flex flex-col">
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">DrugSmart</span>
          </Link>
          <Link to="/register-pharmacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Register a pharmacy →
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sign in to workspace</h1>
            <p className="text-sm text-gray-500 mt-1">
              Use your Pharmacy ID, email, and password
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pharmacyId">Pharmacy ID</Label>
                <Input
                  id="pharmacyId"
                  placeholder="e.g. PH-ABC1-XY23"
                  startIcon={<Hash />}
                  value={pharmacyId}
                  onChange={(e) => setPharmacyId(e.target.value.toUpperCase())}
                  autoComplete="organization"
                  spellCheck={false}
                />
                <p className="text-xs text-muted-foreground">
                  The unique code generated when your pharmacy was registered
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  startIcon={<Mail />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    startIcon={<Lock />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In to Workspace"
                )}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              New pharmacy?{" "}
              <Link to="/register-pharmacy" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-xs text-gray-400">
              Your Pharmacy ID was generated when you registered.
              Contact your pharmacy owner if you don't have it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
