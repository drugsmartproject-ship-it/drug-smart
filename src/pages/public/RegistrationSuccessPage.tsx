import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Copy, Pill, ArrowRight, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function RegistrationSuccessPage() {
  const [params] = useSearchParams();
  const pharmacyId = params.get("pharmacyId") ?? "PH-UNKNOWN";
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyId = () => {
    navigator.clipboard.writeText(pharmacyId).then(() => {
      setCopied(true);
      toast({ title: "Pharmacy ID copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/10 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">DrugSmart</span>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          {/* Green header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-white" />
            <h1 className="text-xl font-bold mb-1">Workspace Created!</h1>
            <p className="text-emerald-100 text-sm">Your pharmacy is now registered on DrugSmart</p>
          </div>

          <div className="p-6">
            {/* Pharmacy ID display */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-foreground mb-2 text-center">
                Your Pharmacy ID / Workspace Code
              </p>
              <div className="bg-gray-50 border-2 border-dashed border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-mono font-bold text-primary tracking-widest mb-3">
                  {pharmacyId}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyId}
                  className="text-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied!" : "Copy ID"}
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-blue-800">Save this Pharmacy ID</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    This is your unique workspace identifier. You and your staff will need it to log in.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <Users className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">Share with Staff</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Staff members will use this Pharmacy ID + their email + password to access your workspace.
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link to="/app/dashboard">
                Go to Your Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              You're logged in as the pharmacy owner.{" "}
              <Link to="/login" className="text-primary hover:underline">Switch account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
