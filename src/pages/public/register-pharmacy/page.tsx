import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/AuthContext";
import { useTheme } from "@/features/theme/ThemeContext";
import { THEME_PRESETS, type ThemeId } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Pill, Building2, User, Mail, Phone, MapPin, Hash,
  Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2,
  Palette, Upload, X, Image,
} from "lucide-react";

interface FormData {
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  town: string;
  licenseNumber: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

const initialForm: FormData = {
  pharmacyName: "",
  ownerName: "",
  email: "",
  phone: "",
  location: "",
  town: "",
  licenseNumber: "",
  displayName: "",
  password: "",
  confirmPassword: "",
};

const steps = [
  { id: 1, title: "Pharmacy Details", description: "Basic information about your pharmacy" },
  { id: 2, title: "Owner Information", description: "Your personal contact details" },
  { id: 3, title: "Secure Access", description: "Set up your login credentials" },
  { id: 4, title: "Customize Workspace", description: "Optional — choose your theme and logo" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

export default function RegisterPharmacyPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("medical-green");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { registerPharmacy } = useAuth();
  const { setTheme, setLogo } = useTheme();
  const navigate = useNavigate();

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validateStep = (s: number): string | null => {
    if (s === 1) {
      if (!form.pharmacyName.trim()) return "Pharmacy name is required";
      if (!form.location.trim()) return "Location/address is required";
      if (!form.town.trim()) return "Town/City is required";
    }
    if (s === 2) {
      if (!form.ownerName.trim()) return "Owner name is required";
      if (!form.email.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email";
      if (!form.phone.trim()) return "Phone number is required";
    }
    if (s === 3) {
      if (!form.password) return "Password is required";
      if (form.password.length < 8) return "Password must be at least 8 characters";
      if (form.password !== form.confirmPassword) return "Passwords do not match";
    }
    return null;
  };

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      toast.error("Validation Error", { description: error });
      return;
    }
    goTo(step + 1);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast.error("Logo too large", { description: "Please use an image under 500 KB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleThemePreview = (id: ThemeId) => {
    setSelectedTheme(id);
    setTheme(id);
  };

  const doSubmit = async () => {
    setIsSubmitting(true);
    try {
      const pharmacyId = await registerPharmacy({
        pharmacyName: form.pharmacyName,
        ownerName: form.ownerName,
        email: form.email,
        phone: form.phone,
        location: form.location,
        town: form.town,
        licenseNumber: form.licenseNumber || undefined,
        displayName: form.displayName || undefined,
        password: form.password,
      });
      setTheme(selectedTheme, pharmacyId);
      if (logoPreview) setLogo(logoPreview, pharmacyId);
      navigate(`/registration-success?pharmacyId=${pharmacyId}`);
    } catch (err) {
      toast.error("Registration Failed", {
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const error = validateStep(3);
    if (error) {
      toast.error("Validation Error", { description: error });
      return;
    }
    await doSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/10 flex flex-col">
      {/* Header */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">DrugSmart</span>
          </Link>
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
            Already registered?
            <span className="text-primary font-medium ml-1">Sign In</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center">
              {steps.map((s, idx) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: step === s.id ? 1.08 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200",
                        step > s.id ? "bg-primary text-white" :
                        step === s.id ? "bg-primary text-white ring-4 ring-primary/20" :
                        "bg-gray-100 text-gray-400"
                      )}
                    >
                      {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                    </motion.div>
                    <div className="mt-1.5 hidden sm:block text-center w-20">
                      <p className={cn(
                        "text-[11px] font-medium leading-tight",
                        step >= s.id ? "text-gray-900" : "text-gray-400"
                      )}>
                        {s.title}
                      </p>
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 relative h-0.5 mx-1 bg-gray-200 overflow-hidden rounded-full">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full"
                        animate={{ width: step > s.id ? "100%" : "0%" }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg border-gray-100 overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
              <div className="flex items-center gap-2">
                {step === 4 && <Palette className="w-4 h-4 text-primary" />}
                <CardTitle className="text-xl">{steps[step - 1]?.title}</CardTitle>
              </div>
              <CardDescription>{steps[step - 1]?.description}</CardDescription>
            </CardHeader>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <CardContent className="space-y-4 pt-4">
                    {/* Step 1: Pharmacy Details */}
                    {step === 1 && (
                      <>
                        <div className="space-y-1.5">
                          <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
                          <Input
                            id="pharmacyName"
                            placeholder="e.g. Accra Central Pharmacy"
                            startIcon={<Building2 />}
                            value={form.pharmacyName}
                            onChange={set("pharmacyName")}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="displayName">
                            Display Name{" "}
                            <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="displayName"
                            placeholder="Shortened name for the workspace"
                            startIcon={<Building2 />}
                            value={form.displayName}
                            onChange={set("displayName")}
                          />
                          <p className="text-xs text-muted-foreground">Defaults to pharmacy name if left blank</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="location">Pharmacy Address / Location *</Label>
                          <Input
                            id="location"
                            placeholder="e.g. No. 12 Oxford Street, Osu"
                            startIcon={<MapPin />}
                            value={form.location}
                            onChange={set("location")}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="town">Town / City *</Label>
                          <Input
                            id="town"
                            placeholder="e.g. Accra, Kumasi, Takoradi"
                            startIcon={<MapPin />}
                            value={form.town}
                            onChange={set("town")}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="licenseNumber">
                            Business / License Number{" "}
                            <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                          </Label>
                          <Input
                            id="licenseNumber"
                            placeholder="e.g. PMRB-0001-2024"
                            startIcon={<Hash />}
                            value={form.licenseNumber}
                            onChange={set("licenseNumber")}
                          />
                        </div>
                      </>
                    )}

                    {/* Step 2: Owner Info */}
                    {step === 2 && (
                      <>
                        <div className="space-y-1.5">
                          <Label htmlFor="ownerName">Owner Full Name *</Label>
                          <Input
                            id="ownerName"
                            placeholder="e.g. Kwame Mensah"
                            startIcon={<User />}
                            value={form.ownerName}
                            onChange={set("ownerName")}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="email">Business Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="e.g. kwame@accrepharmacy.com"
                            startIcon={<Mail />}
                            value={form.email}
                            onChange={set("email")}
                          />
                          <p className="text-xs text-muted-foreground">This will be your login email</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="e.g. 0244 000 000"
                            startIcon={<Phone />}
                            value={form.phone}
                            onChange={set("phone")}
                          />
                        </div>
                      </>
                    )}

                    {/* Step 3: Credentials */}
                    {step === 3 && (
                      <>
                        <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Creating workspace for</p>
                          <p className="text-sm font-semibold text-foreground">{form.pharmacyName}</p>
                          <p className="text-sm text-muted-foreground">{form.town} · {form.ownerName} · {form.email}</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="At least 8 characters"
                            startIcon={<Lock />}
                            endIcon={
                              <button
                                type="button"
                                className="pointer-events-auto hover:text-foreground transition-colors"
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={-1}
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                            value={form.password}
                            onChange={set("password")}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <Input
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Repeat your password"
                            startIcon={<Lock />}
                            endIcon={
                              <button
                                type="button"
                                className="pointer-events-auto hover:text-foreground transition-colors"
                                onClick={() => setShowConfirm((v) => !v)}
                                tabIndex={-1}
                              >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                            value={form.confirmPassword}
                            onChange={set("confirmPassword")}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                          By registering, you confirm that you are the authorised representative of this pharmacy
                          and agree to use DrugSmart in accordance with applicable pharmacy regulations.
                        </p>
                      </>
                    )}

                    {/* Step 4: Branding (optional) */}
                    {step === 4 && (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-0.5">Workspace Theme</p>
                          <p className="text-xs text-muted-foreground mb-3">Select a colour theme. A live preview is applied as you click.</p>
                          <div className="grid grid-cols-2 gap-2">
                            {THEME_PRESETS.map((preset) => (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleThemePreview(preset.id)}
                                className={cn(
                                  "flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all hover:shadow-sm",
                                  selectedTheme === preset.id
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border hover:border-gray-300"
                                )}
                              >
                                <div className="shrink-0 flex">
                                  <div
                                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: preset.primaryHex }}
                                  />
                                  <div
                                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm -ml-2"
                                    style={{ backgroundColor: preset.accentHex }}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-foreground truncate">{preset.name}</p>
                                </div>
                                {selectedTheme === preset.id && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-border pt-4">
                          <p className="text-sm font-semibold text-foreground mb-0.5">
                            Pharmacy Logo{" "}
                            <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">PNG or JPG, max 500 KB. Displays in the sidebar.</p>

                          {logoPreview ? (
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl border border-border overflow-hidden bg-muted flex items-center justify-center">
                                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => logoInputRef.current?.click()}
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  Replace
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setLogoPreview(null)}
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => logoInputRef.current?.click()}
                              className="w-full flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/3 transition-all text-muted-foreground hover:text-primary"
                            >
                              <Image className="w-6 h-6" />
                              <span className="text-sm font-medium">Click to upload logo</span>
                            </button>
                          )}
                          <input
                            ref={logoInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                        </div>

                        <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs text-muted-foreground">
                          These settings can be changed anytime in <strong className="text-foreground">Settings → Branding</strong>.
                        </div>
                      </>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/40">
                      {step > 1 ? (
                        <Button variant="ghost" onClick={() => goTo(step - 1)} size="sm">
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/">
                            <ArrowLeft className="w-4 h-4" />
                            Home
                          </Link>
                        </Button>
                      )}

                      <div className="flex items-center gap-2">
                        {step === 4 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="text-muted-foreground"
                          >
                            Skip for now
                          </Button>
                        )}
                        {step < 4 ? (
                          <Button onClick={handleNext}>
                            Continue
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Creating…
                              </>
                            ) : (
                              <>
                                Create Workspace
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have a workspace?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
