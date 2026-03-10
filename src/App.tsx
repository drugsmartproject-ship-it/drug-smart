import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ThemeProvider } from "@/features/theme/ThemeContext";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth/ProtectedRoute";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/motion/PageTransition";
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

const convexUrl = process.env.VITE_CONVEX_URL as string;
const convex = new ConvexReactClient(convexUrl);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
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

        {/* Protected app routes — each wrapped in PageTransition for enter animation */}
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <AppShell>
                <PageTransition><DashboardPage /></PageTransition>
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/inventory"
          element={
            <ProtectedRoute>
              <AppShell>
                <PageTransition><InventoryPage /></PageTransition>
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/sales"
          element={
            <ProtectedRoute>
              <AppShell>
                <ProtectedRoute requiredPermission="canProcessSales">
                  <PageTransition><SalesPage /></PageTransition>
                </ProtectedRoute>
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/drug-intelligence"
          element={
            <ProtectedRoute>
              <AppShell>
                <ProtectedRoute requiredPermission="canAccessDrugIntel">
                  <PageTransition><DrugIntelligencePage /></PageTransition>
                </ProtectedRoute>
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/clinical-support"
          element={
            <ProtectedRoute>
              <AppShell>
                <ProtectedRoute requiredPermission="canAccessDrugIntel">
                  <PageTransition><ClinicalSupportPage /></PageTransition>
                </ProtectedRoute>
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/analytics"
          element={
            <ProtectedRoute>
              <AppShell>
                <ProtectedRoute requiredPermission="canAccessAnalytics">
                  <PageTransition><AnalyticsPage /></PageTransition>
                </ProtectedRoute>
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/users"
          element={
            <ProtectedRoute>
              <AppShell>
                <ProtectedRoute requiredPermission="canManageUsers">
                  <PageTransition><UsersPage /></PageTransition>
                </ProtectedRoute>
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/settings"
          element={
            <ProtectedRoute>
              <AppShell>
                <PageTransition><SettingsPage /></PageTransition>
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* Fallbacks */}
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AnimatedRoutes />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ConvexProvider>
  );
}
