import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Search, AlertTriangle, Info, Pill, ShieldAlert,
  ThumbsUp, XCircle, Package, BookOpen, RefreshCw,
} from "lucide-react";
import type { DrugIntelligenceResult } from "@/types";

// Static drug reference database (production would fetch from FDA API or a drug DB)
const DRUG_DATABASE: Record<string, DrugIntelligenceResult> = {
  "paracetamol": {
    genericName: "Paracetamol (Acetaminophen)",
    brandNames: ["Panadol", "Tylenol", "Efferalgan", "Emzor Paracetamol", "Paracetemol-500"],
    category: "Analgesics & Anti-inflammatory",
    uses: ["Mild to moderate pain relief", "Fever reduction", "Headache", "Dental pain", "Post-operative pain management"],
    dosageForm: ["Tablets (500mg, 1000mg)", "Syrup (120mg/5ml, 250mg/5ml)", "Suppositories", "IV infusion"],
    commonDosage: "Adults: 500mg–1000mg every 4–6 hours. Max 4g/day. Children: 10–15mg/kg every 4–6 hours.",
    warnings: [
      "Do not exceed 4g per day in adults",
      "Avoid concurrent use with other paracetamol-containing products",
      "Use with caution in patients with hepatic impairment",
      "Alcohol consumption increases risk of hepatotoxicity",
    ],
    contraindications: ["Severe hepatic impairment", "Known hypersensitivity to paracetamol"],
    sideEffects: ["Rare: skin rash, blood disorders (with excessive use)", "Hepatotoxicity (overdose)"],
    interactions: ["Warfarin (may potentiate anticoagulant effect)", "Alcohol", "Anticonvulsants (may reduce paracetamol efficacy)"],
    storageConditions: "Store below 25°C. Keep away from moisture and direct light.",
    pregnancyCategory: "B – generally considered safe in recommended doses",
    requiresPrescription: false,
  },
  "amoxicillin": {
    genericName: "Amoxicillin",
    brandNames: ["Amoxil", "Trimox", "Ospamox", "Amox-Clav (with clavulanate)"],
    category: "Antibiotics & Antivirals",
    uses: ["Bacterial infections of ear, nose, throat", "Lower respiratory tract infections", "Urinary tract infections", "Skin infections", "H. pylori eradication (triple therapy)"],
    dosageForm: ["Capsules (250mg, 500mg)", "Tablets (250mg, 500mg, 875mg)", "Oral suspension (125mg/5ml, 250mg/5ml)", "Injection"],
    commonDosage: "Adults: 250–500mg every 8 hours or 875mg every 12 hours. Children: 25–45mg/kg/day divided every 8–12 hours.",
    warnings: [
      "Complete the full course — stopping early may cause antibiotic resistance",
      "Not effective against viral infections (colds, flu)",
      "Inform doctor of any penicillin allergy",
      "May reduce efficacy of oral contraceptives",
    ],
    contraindications: ["Penicillin hypersensitivity", "Mononucleosis (risk of rash)"],
    sideEffects: ["Diarrhea", "Nausea", "Skin rash", "Allergic reactions (anaphylaxis in rare cases)", "Candidal superinfection"],
    interactions: ["Warfarin", "Methotrexate", "Probenecid (increases amoxicillin levels)", "Oral contraceptives"],
    storageConditions: "Store capsules/tablets below 25°C. Reconstituted suspension: refrigerate, use within 7–14 days.",
    pregnancyCategory: "B – generally considered safe",
    requiresPrescription: true,
  },
  "metformin": {
    genericName: "Metformin Hydrochloride",
    brandNames: ["Glucophage", "Diabex", "Metformin-500", "Glucomet"],
    category: "Diabetes & Endocrine",
    uses: ["Type 2 diabetes mellitus (first-line therapy)", "Polycystic ovary syndrome (off-label)", "Pre-diabetes prevention"],
    dosageForm: ["Tablets (500mg, 850mg, 1000mg)", "Extended-release tablets", "Oral solution"],
    commonDosage: "Initial: 500mg twice daily or 850mg once daily with meals. Maintenance: 1500–2000mg/day. Max: 2550mg/day.",
    warnings: [
      "Hold 48 hours before and after iodinated contrast media procedures",
      "Monitor renal function — reduce dose or discontinue if eGFR falls below 30",
      "Rare risk of lactic acidosis — especially with renal impairment or excessive alcohol",
      "Take with food to reduce GI side effects",
    ],
    contraindications: ["eGFR < 30 mL/min/1.73m²", "Severe hepatic impairment", "Sepsis or dehydration", "Excessive alcohol use"],
    sideEffects: ["GI upset, diarrhea, nausea (usually transient)", "Metallic taste", "Vitamin B12 deficiency (long-term)", "Lactic acidosis (rare but serious)"],
    interactions: ["Alcohol (increases lactic acidosis risk)", "Iodinated contrast media", "Carbonic anhydrase inhibitors"],
    storageConditions: "Store at room temperature (15–30°C). Protect from light and moisture.",
    pregnancyCategory: "B – consult prescriber; insulin may be preferred in pregnancy",
    requiresPrescription: true,
  },
  "ibuprofen": {
    genericName: "Ibuprofen",
    brandNames: ["Brufen", "Advil", "Nurofen", "Ibucap", "Emzor Ibuprofen"],
    category: "Analgesics & Anti-inflammatory",
    uses: ["Pain and inflammation", "Fever", "Headache, dental pain", "Menstrual cramps", "Arthritis (short-term)"],
    dosageForm: ["Tablets (200mg, 400mg, 600mg, 800mg)", "Capsules", "Suspension (100mg/5ml)", "Gel/cream (topical)"],
    commonDosage: "Adults: 200–400mg every 4–6 hours (OTC). Up to 800mg 3 times daily with food (prescription). Max: 3200mg/day.",
    warnings: [
      "Take with food or milk to reduce stomach irritation",
      "Avoid in patients with peptic ulcer disease",
      "Use with caution in elderly, renal/hepatic impairment",
      "May increase risk of cardiovascular events with long-term use",
      "Avoid in last trimester of pregnancy",
    ],
    contraindications: ["Active GI ulcer or bleeding", "Severe renal/hepatic impairment", "Aspirin/NSAID hypersensitivity", "Third trimester of pregnancy"],
    sideEffects: ["GI irritation, nausea", "Headache", "Fluid retention", "Elevated blood pressure", "Increased bleeding risk"],
    interactions: ["Warfarin/anticoagulants", "Aspirin", "ACE inhibitors", "Lithium", "Corticosteroids"],
    storageConditions: "Store below 25°C. Protect from moisture.",
    pregnancyCategory: "C/D – avoid in third trimester",
    requiresPrescription: false,
  },
};

export default function DrugIntelligencePage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<DrugIntelligenceResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearched(false);

    // Simulate async search
    await new Promise((r) => setTimeout(r, 400));

    const key = query.trim().toLowerCase().split(" ")[0];
    const match = Object.entries(DRUG_DATABASE).find(
      ([k, v]) =>
        k.includes(key ?? "") ||
        v.genericName.toLowerCase().includes(key ?? "") ||
        v.brandNames.some((b) => b.toLowerCase().includes(key ?? ""))
    );

    setResult(match ? match[1] : null);
    setSearched(true);
    setIsSearching(false);
  };

  const suggestions = ["Paracetamol", "Amoxicillin", "Metformin", "Ibuprofen"];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Pill className="w-6 h-6 text-primary" />
          Drug Intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Reference tool for drug information, warnings, dosage guidance, and interactions.
        </p>
      </div>

      {/* Disclaimer Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 mb-6">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Reference Tool Only</p>
          <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
            This tool provides general drug reference information for licensed pharmacy staff. It is <strong>not a prescribing system</strong> and does not replace professional clinical judgement. Always consult a qualified prescriber for patient-specific decisions.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search by drug name, generic name, or brand name…"
          startIcon={<Search />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
          {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </Button>
      </div>

      {/* Suggestions */}
      {!searched && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-muted-foreground self-center">Try:</span>
          {suggestions.map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => { setQuery(s); }}
            >
              {s}
            </Button>
          ))}
        </div>
      )}

      {/* Results */}
      {searched && !result && (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium">No results found for "{query}"</p>
          <p className="text-sm mt-1">Try a different drug name or generic name</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Drug Header */}
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-foreground">{result.genericName}</h2>
                    {result.requiresPrescription ? (
                      <Badge variant="warning">Rx Only</Badge>
                    ) : (
                      <Badge variant="success">OTC</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {result.brandNames.map((b) => (
                      <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                    ))}
                  </div>
                  <Badge variant="brand">{result.category}</Badge>
                </div>
                {result.pregnancyCategory && (
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Pregnancy</p>
                    <p className="text-xs font-medium">{result.pregnancyCategory}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Uses */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-500" />
                  Common Uses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {result.uses.map((u) => (
                    <li key={u} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {u}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Dosage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Dosage Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Available Forms</p>
                    <div className="flex flex-wrap gap-1">
                      {result.dosageForm.map((f) => (
                        <span key={f} className="text-xs bg-muted px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Typical Dosage</p>
                    <p className="text-sm text-foreground leading-relaxed">{result.commonDosage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warnings */}
            <Card className="border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                  Warnings & Precautions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {result.warnings.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contraindications */}
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                  <XCircle className="w-4 h-4" />
                  Contraindications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {result.contraindications.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-red-800">
                      <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Side Effects & Interactions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-orange-500" />
                  Side Effects
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {result.sideEffects.map((s) => (
                    <li key={s} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-violet-500" />
                  Drug Interactions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {result.interactions.map((i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground">Storage: {result.storageConditions}</p>
              </CardContent>
            </Card>
          </div>

          {/* Final Disclaimer */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Disclaimer:</strong> This information is for reference only and may not be complete or up-to-date.
              It does not constitute medical advice or a prescription. Always refer patients to a licensed prescriber for
              clinical decisions. DrugSmart is a pharmacy management tool — not a clinical decision system.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
