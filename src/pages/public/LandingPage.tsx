import { Link } from "react-router-dom";
import {
  ShieldCheck, BarChart3, Package, Users, Zap, Globe,
  ArrowRight, CheckCircle2, Star, ChevronRight,
  Pill, Activity, TrendingUp, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Package,
    title: "Smart Inventory Control",
    description: "Track drug stock levels, expiry dates, and reorder points in real time. Receive alerts before you run out.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: BarChart3,
    title: "Sales & Transactions",
    description: "Process sales quickly, issue receipts, and track revenue with detailed daily summaries.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Pill,
    title: "Drug Intelligence",
    description: "Look up drug reference data, interactions, warnings, and clinical notes to assist safe dispensing.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Activity,
    title: "Clinical Decision Support",
    description: "Symptom-to-drug-category guidance for licensed practitioners. Always backed by a clear disclaimer.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    description: "Understand your business with sales trends, top-selling items, and category performance charts.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Users,
    title: "Role-Based Staff Access",
    description: "Owner, Admin, Cashier, Pharmacist, and Inventory Manager — each with appropriate access controls.",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

const benefits = [
  "Works on desktop, tablet, and mobile devices",
  "Pharmacy-specific workspace — your data stays yours",
  "Low stock and expiry date alerts",
  "Full transaction history and receipt generation",
  "Secure multi-user access with role permissions",
  "Built for Ghanaian pharmacy operations",
];

const stats = [
  { value: "500+", label: "Pharmacies Supported" },
  { value: "99.9%", label: "Uptime Reliability" },
  { value: "< 2s", label: "Average Load Time" },
  { value: "GHS", label: "Ghana Cedi Native" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Pill className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">DrugSmart</span>
              <Badge variant="brand" className="hidden sm:inline-flex text-[10px] px-1.5 py-0 ml-1">Ghana</Badge>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</button>
              <button onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Benefits</button>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0">
                <Link to="/register-pharmacy">
                  <span className="hidden sm:inline">Register Free</span>
                  <span className="sm:hidden">Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="sm:hidden">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/20 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFMwIDguMDYgMCAxOHM4LjA2IDE4IDE4IDE4IDE4LTguMDYgMTgtMTh6IiBmaWxsPSIjMUZBNjdBIiBvcGFjaXR5PSIuMDMiLz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 sm:mb-8">
            <Zap className="w-3 h-3" />
            Built for Ghanaian Pharmacies
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Run your pharmacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              smarter, faster
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            DrugSmart is the all-in-one pharmacy management platform designed for independent
            pharmacy shops in Ghana. Inventory, sales, drug intelligence, and team management — in one workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-200/50">
              <Link to="/register-pharmacy">
                Register Your Pharmacy
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link to="/login">
                Log In to Workspace
              </Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-gray-500">
            No credit card required · Free to get started · Your data stays secure
          </p>
        </div>

      </section>

      {/* Features */}
      <section id="features" className="py-14 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <Badge variant="brand" className="mb-3 sm:mb-4">Platform Capabilities</Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything your pharmacy needs
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-xl mx-auto">
              From daily dispensing to month-end analytics, DrugSmart covers the full operational lifecycle of your pharmacy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-gray-100 hover:border-emerald-100 hover:shadow-md transition-all duration-200 bg-white">
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-14 sm:py-24 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <Badge className="bg-white/10 text-white border-white/20 mb-4 sm:mb-6">Why DrugSmart</Badge>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Designed for the realities of running a pharmacy in Ghana
              </h2>
              <p className="text-emerald-100 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8">
                We understand the operational challenges of independent pharmacies: supplier management, stock expiry,
                staff access control, and the need for real-time business insight. DrugSmart was built around these needs.
              </p>
              <div className="space-y-3">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                    <span className="text-emerald-50 text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, title: "Secure & Private", desc: "Your pharmacy's data is isolated in its own workspace" },
                { icon: Globe, title: "Works Everywhere", desc: "Accessible from any device with a modern browser" },
                { icon: Lock, title: "Role Permissions", desc: "Each staff role sees only what they need" },
                { icon: Star, title: "Reliable Platform", desc: "Built on enterprise-grade infrastructure" },
              ].map((item) => (
                <div key={item.title} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
                  <item.icon className="w-6 h-6 text-white mb-3" />
                  <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-emerald-200 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ready to modernise your pharmacy?
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Join hundreds of pharmacy owners in Ghana who trust DrugSmart to manage their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" asChild className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-200/50">
              <Link to="/register-pharmacy">
                Register Your Pharmacy
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Pill className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">DrugSmart</span>
            <span className="text-xs text-gray-400">· Pharmacy Management Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Contact Us</Link>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} DrugSmart. For reference and operational use only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
