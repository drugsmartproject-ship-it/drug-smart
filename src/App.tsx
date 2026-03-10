import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth/ProtectedRoute";
import { AppShell } from "@/layouts/AppShell";
import { Toaster } from "@/components/ui/toaster";

// Public Pages
import LandingPage from "@/pages/public/LandingPage";
import RegisterPharmacyPage from "@/pages/public/RegisterPharmacyPage";
import LoginPage from "@/pages/public/LoginPage";
import RegistrationSuccessPage from "@/pages/public/RegistrationSuccessPage";
import ForgotPasswordPage from "@/pages/public/ForgotPasswordPage";

// App Pages
import DashboardPage from "@/pages/app/DashboardPage";
import InventoryPage from "@/pages/app/InventoryPage";
import SalesPage from "@/pages/app/SalesPage";
import DrugIntelligencePage from "@/pages/app/DrugIntelligencePage";
import ClinicalSupportPage from "@/pages/app/ClinicalSupportPage";
import AnalyticsPage from "@/pages/app/AnalyticsPage";
import UsersPage from "@/pages/app/UsersPage";
import SettingsPage from "@/pages/app/SettingsPage";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
const convex = new ConvexReactClient(convexUrl);

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/register-pharmacy"
              element={
                <PublicOnlyRoute>
                  <RegisterPharmacyPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route path="/registration-success" element={<RegistrationSuccessPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected app routes */}
            <Route
              path="/app/dashboard"
              element={<AppLayout><DashboardPage /></AppLayout>}
            />
            <Route
              path="/app/inventory"
              element={<AppLayout><InventoryPage /></AppLayout>}
            />
            <Route
              path="/app/sales"
              element={
                <AppLayout>
                  <ProtectedRoute requiredPermission="canProcessSales">
                    <SalesPage />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/app/drug-intelligence"
              element={
                <AppLayout>
                  <ProtectedRoute requiredPermission="canAccessDrugIntel">
                    <DrugIntelligencePage />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/app/clinical-support"
              element={
                <AppLayout>
                  <ProtectedRoute requiredPermission="canAccessDrugIntel">
                    <ClinicalSupportPage />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/app/analytics"
              element={
                <AppLayout>
                  <ProtectedRoute requiredPermission="canAccessAnalytics">
                    <AnalyticsPage />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/app/users"
              element={
                <AppLayout>
                  <ProtectedRoute requiredPermission="canManageUsers">
                    <UsersPage />
                  </ProtectedRoute>
                </AppLayout>
              }
            />
            <Route
              path="/app/settings"
              element={<AppLayout><SettingsPage /></AppLayout>}
            />

            {/* Fallbacks */}
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ConvexProvider>
  );
}
