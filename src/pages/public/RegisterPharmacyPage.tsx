import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Pill, Building2, User, Mail, Phone, MapPin, Hash,
  Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2,
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
];

export default function RegisterPharmacyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerPharmacy } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      toast({ variant: "destructive", title: "Validation Error", description: error });
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    const error = validateStep(3);
    if (error) {
      toast({ variant: "destructive", title: "Validation Error", description: error });
      return;
    }

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
      navigate(`/registration-success?pharmacyId=${pharmacyId}`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/10 flex flex-col">
      {/* Header */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">DrugSmart</span>
          </Link>
          <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
            Already registered?
            <span className="text-primary font-medium">Sign In</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, idx) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      step > s.id
                        ? "bg-primary text-white"
                        : step === s.id
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                    </div>
                    <div className="mt-1.5 hidden sm:block text-center">
                      <p className={`text-xs font-medium ${step >= s.id ? "text-gray-900" : "text-gray-400"}`}>
                        {s.title}
                      </p>
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all ${step > s.id ? "bg-primary" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">{steps[step - 1]?.title}</CardTitle>
              <CardDescription>{steps[step - 1]?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <Label htmlFor="displayName">Display Name (optional)</Label>
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
                    <Label htmlFor="licenseNumber">Business / License Number (optional)</Label>
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
                  <div className="bg-muted/50 rounded-xl p-4 mb-2">
                    <p className="text-sm font-medium text-foreground mb-1">Creating workspace for:</p>
                    <p className="text-sm text-muted-foreground">{form.pharmacyName} · {form.town}</p>
                    <p className="text-sm text-muted-foreground">{form.ownerName} &lt;{form.email}&gt;</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        startIcon={<Lock />}
                        value={form.password}
                        onChange={set("password")}
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
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat your password"
                        startIcon={<Lock />}
                        value={form.confirmPassword}
                        onChange={set("confirmPassword")}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirm((v) => !v)}
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By registering, you confirm that you are the authorised representative of this pharmacy
                    and agree to use DrugSmart in accordance with applicable pharmacy regulations.
                  </p>
                </>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                {step > 1 ? (
                  <Button variant="ghost" onClick={() => setStep((s) => s - 1)} size="sm">
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
                {step < 3 ? (
                  <Button onClick={handleNext}>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Creating workspace…
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
            </CardContent>
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
