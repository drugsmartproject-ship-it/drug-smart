import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles, MapPin } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

// ─── Step definitions ─────────────────────────────────────────────────────────

interface TourStep {
  target?: string; // data-tour attribute; omit for a centred modal
  title: string;
  body: string;
  position?: "top" | "bottom" | "left" | "right";
}

const STEPS: TourStep[] = [
  {
    title: "Welcome to DrugSmart!",
    body: "Let's take a 60-second tour of your pharmacy workspace so you can hit the ground running.",
  },
  {
    target: "tour-nav",
    title: "Main Navigation",
    body: "Use the sidebar to move between all sections. On mobile, tap the ☰ menu icon to open it.",
    position: "right",
  },
  {
    target: "tour-nav-dashboard",
    title: "Dashboard",
    body: "Your home base — today's revenue, transaction count, stock alerts, and expiring items at a glance.",
    position: "right",
  },
  {
    target: "tour-nav-sales",
    title: "Point of Sale",
    body: "Process customer transactions here. Search for drugs, build a cart, apply discounts, and print receipts.",
    position: "right",
  },
  {
    target: "tour-nav-inventory",
    title: "Inventory",
    body: "Add drugs, set reorder levels, monitor expiry dates, and track your full stock in one place.",
    position: "right",
  },
  {
    target: "tour-nav-drug-intel",
    title: "Drug Intelligence",
    body: "Look up any drug for dosage guidance, warnings, contraindications, and interactions.",
    position: "right",
  },
  {
    target: "tour-nav-analytics",
    title: "Analytics",
    body: "Revenue trends, top-selling drugs, transaction volume, and inventory health — all in one view.",
    position: "right",
  },
  {
    target: "tour-bell",
    title: "Notifications",
    body: "Low stock alerts, expiring item warnings, and daily summaries surface here automatically.",
    position: "bottom",
  },
  {
    target: "tour-user-profile",
    title: "Your Profile",
    body: "Manage your account, switch themes, and sign out. Owners and admins can also manage team members here.",
    position: "top",
  },
  {
    title: "You're all set!",
    body: "You now know the essentials of DrugSmart. You can replay this tour anytime from Settings → Help.",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface TourContextValue {
  startTour: () => void;
}
const TourContext = createContext<TourContextValue>({ startTour: () => {} });
export function useTour() { return useContext(TourContext); }

// ─── Spotlight geometry ───────────────────────────────────────────────────────

const PAD = 8;   // padding around the highlighted element
const GAP = 14;  // gap between spotlight and tooltip

interface Rect { top: number; left: number; width: number; height: number }

function getVisibleRect(target: string): Rect | null {
  // Pick the first matching element that is actually visible (width > 0)
  const els = document.querySelectorAll(`[data-tour="${target}"]`);
  for (const el of Array.from(els)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      return { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 };
    }
  }
  return null;
}

// ─── Overlay component ────────────────────────────────────────────────────────

function TourOverlay({
  step, stepIndex, total, onPrev, onNext, onSkip,
}: {
  step: TourStep; stepIndex: number; total: number;
  onPrev: () => void; onNext: () => void; onSkip: () => void;
}) {
  const [rect, setRect] = useState<Rect | null>(null);
  const isFirst = stepIndex === 0;
  const isLast  = stepIndex === total - 1;

  // Recalculate spotlight rect whenever the step changes
  useEffect(() => {
    if (!step.target) { setRect(null); return; }
    const update = () => setRect(getVisibleRect(step.target!));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [step.target]);

  // Position the tooltip card relative to the spotlight (or centre if no rect)
  const tooltipStyle = (): React.CSSProperties => {
    const CARD_W = 320;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (!rect) {
      return { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: `min(${CARD_W}px, calc(100vw - 32px))`, zIndex: 9999 };
    }

    const base: React.CSSProperties = { position: "fixed", zIndex: 9999, width: `min(${CARD_W}px, calc(100vw - 32px))` };
    const pos = step.position ?? "right";

    if (pos === "right") {
      // Prefer right; fall back to left if not enough space
      const leftEdge = rect.left + rect.width + GAP;
      if (leftEdge + CARD_W > vw) {
        base.right = `${vw - rect.left + GAP}px`;
      } else {
        base.left = `${leftEdge}px`;
      }
      base.top = `${Math.max(16, Math.min(rect.top + rect.height / 2 - 100, vh - 240))}px`;
    } else if (pos === "left") {
      base.right = `${vw - rect.left + GAP}px`;
      base.top = `${Math.max(16, Math.min(rect.top + rect.height / 2 - 100, vh - 240))}px`;
    } else if (pos === "bottom") {
      base.top = `${rect.top + rect.height + GAP}px`;
      base.left = `${Math.max(16, Math.min(rect.left, vw - CARD_W - 16))}px`;
    } else { // top
      base.bottom = `${vh - rect.top + GAP}px`;
      base.left = `${Math.max(16, Math.min(rect.left, vw - CARD_W - 16))}px`;
    }
    return base;
  };

  return (
    <div className="fixed inset-0 z-[9998]">
      {/* 4-panel dark overlay that cuts around the spotlight */}
      {rect ? (
        <>
          {/* top */}
          <div className="absolute bg-black/60" style={{ top: 0, left: 0, right: 0, height: rect.top }} />
          {/* left */}
          <div className="absolute bg-black/60" style={{ top: rect.top, left: 0, width: rect.left, height: rect.height }} />
          {/* right */}
          <div className="absolute bg-black/60" style={{ top: rect.top, left: rect.left + rect.width, right: 0, height: rect.height }} />
          {/* bottom */}
          <div className="absolute bg-black/60" style={{ top: rect.top + rect.height, left: 0, right: 0, bottom: 0 }} />
          {/* spotlight border ring */}
          <motion.div
            key={step.target}
            className="absolute rounded-xl pointer-events-none"
            style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, border: "2px solid rgba(255,255,255,0.5)", boxShadow: "0 0 0 4px rgba(255,255,255,0.08)" }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        </>
      ) : (
        // No spotlight — just a full dark backdrop
        <div className="absolute inset-0 bg-black/60" />
      )}

      {/* Tooltip / Modal card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          style={tooltipStyle()}
          className="bg-card rounded-2xl shadow-2xl border border-border p-5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {/* Progress dots + close */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === stepIndex ? 16 : 6,
                    background: i === stepIndex ? "var(--color-primary)" : i < stepIndex ? "color-mix(in srgb, var(--color-primary) 40%, transparent)" : "var(--color-muted)",
                  }}
                />
              ))}
            </div>
            <button onClick={onSkip} className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Icon for first/last steps */}
          {(!step.target) && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              {isLast
                ? <Sparkles className="w-5 h-5 text-primary" />
                : <MapPin className="w-5 h-5 text-primary" />}
            </div>
          )}

          <h3 className="font-bold text-base text-foreground mb-1.5">{step.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
            <button onClick={onSkip} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Skip tour
            </button>
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={onPrev}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg hover:bg-muted"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Back
                </button>
              )}
              <button
                onClick={onNext}
                className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                {isLast ? "Done!" : "Next"}
                {!isLast && <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  const storageKey = user ? `drugsmart_tour_${user.id}` : null;

  // Auto-start once for new users (after a short delay to let the UI settle)
  useEffect(() => {
    if (!storageKey) return;
    if (localStorage.getItem(storageKey)) return;
    const t = setTimeout(() => setActive(true), 900);
    return () => clearTimeout(t);
  }, [storageKey]);

  const endTour = useCallback(() => {
    setActive(false);
    if (storageKey) localStorage.setItem(storageKey, "1");
  }, [storageKey]);

  const startTour = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else endTour();
  }, [step, endTour]);

  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
      <AnimatePresence>
        {active && (
          <TourOverlay
            step={STEPS[step]!}
            stepIndex={step}
            total={STEPS.length}
            onNext={next}
            onPrev={prev}
            onSkip={endTour}
          />
        )}
      </AnimatePresence>
    </TourContext.Provider>
  );
}
