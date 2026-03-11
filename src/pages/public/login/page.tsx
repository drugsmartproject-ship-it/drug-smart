import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Pill, Hash, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  pharmacyId: z.string().min(1, "Pharmacy ID is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/app/dashboard";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { pharmacyId: "", email: "", password: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      await login(data.pharmacyId.trim().toUpperCase(), data.email.trim(), data.password);
      toast.success("Welcome back!", { description: "Signed in successfully." });
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/10 flex flex-col">
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">DrugSmart</span>
          </Link>
          <Link
            to="/register-pharmacy"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            Register a pharmacy
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in to workspace</h1>
            <p className="text-sm text-gray-500 mt-1.5">
              Use your Pharmacy ID, email, and password
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/5 p-6">
            {serverError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-3 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="pharmacyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. PH-ABC1-XY23"
                          startIcon={<Hash />}
                          autoComplete="organization"
                          spellCheck={false}
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Generated when your pharmacy was registered
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          startIcon={<Mail />}
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Your password"
                          startIcon={<Lock />}
                          endIcon={
                            <button
                              type="button"
                              tabIndex={-1}
                              className="hover:text-foreground transition-colors"
                              onClick={() => setShowPassword((v) => !v)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
            </Form>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              New pharmacy?{" "}
              <Link to="/register-pharmacy" className="text-primary font-semibold hover:underline">
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
