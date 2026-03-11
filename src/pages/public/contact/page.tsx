import { Link } from "react-router-dom";
import { Pill, Phone, Mail, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
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
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Us</h1>
            <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
              Have a question or need help? Reach out to us and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-900/5 divide-y divide-gray-100 overflow-hidden">
            {/* Phone numbers */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Call Us</h2>
              </div>
              <div className="space-y-3">
                <a
                  href="tel:+233500812892"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                      +233 500 812 892
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Primary line</p>
                  </div>
                  <Phone className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </a>
                <a
                  href="tel:+233598131461"
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                      +233 598 131 461
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Alternative line</p>
                  </div>
                  <Phone className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900">Email Us</h2>
              </div>
              <a
                href="mailto:drugsmartproject@gmail.com"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors break-all">
                    drugsmartproject@gmail.com
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">We typically reply within 24 hours</p>
                </div>
                <Mail className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
              </a>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">Sign in to your workspace</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
