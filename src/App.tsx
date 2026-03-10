import { BrowserRouter, Routes, Route, Navigate, useLocation, useRoutes } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ThemeProvider } from "@/features/theme/ThemeContext";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth/ProtectedRoute";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/motion/PageTransition";
import { Toaster } from "sonner";

// Public Pages
import LandingPage from "@/pages/public/LandingPage";
import RegisterPharmacyPage from "@/pages/public/register-pharmacy/page";
import LoginPage from "@/pages/public/login/page";
import RegistrationSuccessPage from "@/pages/public/registration-success/page";
import ForgotPasswordPage from "@/pages/public/forgot-password/page";

// App Pages
import DashboardPage from "@/pages/app/dashboard/page";
import InventoryPage from "@/pages/app/inventory/page";
import SalesPage from "@/pages/app/sales/page";
import DrugIntelligencePage from "@/pages/app/drug-intelligence/page";
import ClinicalSupportPage from "@/pages/app/clinical-support/page";
import AnalyticsPage from "@/pages/app/analytics/page";
import UsersPage from "@/pages/app/users/page";
import SettingsPage from "@/pages/app/settings/page";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
const convex = new ConvexReactClient(convexUrl);

/**
 * AnimatedAppContent uses useRoutes (relative to the /app/* parent) + AnimatePresence.
 * Keying PageTransition by pathname gives the exit→enter page animation.
 * AppShell stays mounted throughout — no remounting on navigation.
 */
function AnimatedAppContent() {
  const location = useLocation();

  const element = useRoutes([
    { path: "dashboard", element: <DashboardPage /> },
    { path: "inventory", element: <InventoryPage /> },
    {
      path: "sales",
      element: (
        <ProtectedRoute requiredPermission="canProcessSales">
          <SalesPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "drug-intelligence",
      element: (
        <ProtectedRoute requiredPermission="canAccessDrugIntel">
          <DrugIntelligencePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "clinical-support",
      element: (
        <ProtectedRoute requiredPermission="canAccessDrugIntel">
          <ClinicalSupportPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "analytics",
      element: (
        <ProtectedRoute requiredPermission="canAccessAnalytics">
          <AnalyticsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "users",
      element: (
        <ProtectedRoute requiredPermission="canManageUsers">
          <UsersPage />
        </ProtectedRoute>
      ),
    },
    { path: "settings", element: <SettingsPage /> },
    { path: "", element: <Navigate to="/app/dashboard" replace /> },
    { path: "*", element: <Navigate to="/app/dashboard" replace /> },
  ]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname}>
        {element}
      </PageTransition>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register-pharmacy" element={<PublicOnlyRoute><RegisterPharmacyPage /></PublicOnlyRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/registration-success" element={<RegistrationSuccessPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected shell — AppShell mounts ONCE for all /app/* routes */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <AnimatedAppContent />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster position="top-right" richColors closeButton />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ConvexProvider>
  );
}
