import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Stethoscope, ArrowRight, Info, ShieldAlert, RefreshCw } from "lucide-react";

interface SuggestionResult {
  symptomSummary: string;
  drugCategories: Array<{
    category: string;
    rationale: string;
    examples: string[];
    notes?: string;
  }>;
  redFlags: string[];
  referralAdvice?: string;
}

const SYMPTOM_MAP: Array<{
  keywords: string[];
  result: SuggestionResult;
}> = [
  {
    keywords: ["fever", "temperature", "pyrexia", "hot", "malaria"],
    result: {
      symptomSummary: "Fever / Pyrexia",
      drugCategories: [
        {
          category: "Antipyretics",
          rationale: "First-line for fever management in uncomplicated cases",
          examples: ["Paracetamol (Panadol)", "Ibuprofen"],
          notes: "Use paracetamol as first-line. Consider ibuprofen for anti-inflammatory component but avoid in dehydration.",
        },
        {
          category: "Antimalarials",
          rationale: "If malaria is suspected (especially in endemic areas like Ghana)",
          examples: ["Artemether-Lumefantrine (AL)", "Artesunate-Amodiaquine", "Artesunate"],
          notes: "Malaria RDT or blood film should guide treatment. Do not dispense antimalarials without clinical indication.",
        },
      ],
      redFlags: [
        "Fever > 39.5°C not responding to antipyretics after 2 hours",
        "Fever with stiff neck, confusion, or photophobia (possible meningitis)",
        "Fever with severe headache and no response to treatment",
        "Febrile convulsions in children",
        "Fever in pregnant women — refer urgently",
      ],
      referralAdvice: "Persistent fever beyond 3 days, or fever with neurological signs — refer to a medical facility immediately.",
    },
  },
  {
    keywords: ["cough", "cold", "runny nose", "respiratory", "chest", "congestion"],
    result: {
      symptomSummary: "Upper Respiratory Symptoms",
      drugCategories: [
        {
          category: "Antihistamines / Decongestants",
          rationale: "For symptomatic relief of runny nose, sneezing, and nasal congestion",
          examples: ["Chlorpheniramine", "Loratadine", "Pseudoephedrine (with supervision)"],
        },
        {
          category: "Cough Suppressants / Expectorants",
          rationale: "For cough relief",
          examples: ["Dextromethorphan (dry cough)", "Guaifenesin (productive cough)", "Pholcodine linctus"],
          notes: "Avoid in children under 2. Productive cough generally should not be suppressed.",
        },
        {
          category: "Analgesics/Antipyretics",
          rationale: "If fever or sore throat is present",
          examples: ["Paracetamol", "Ibuprofen"],
        },
      ],
      redFlags: [
        "Cough with blood-streaked sputum",
        "Chest pain or shortness of breath",
        "Cough lasting more than 3 weeks",
        "High fever with productive cough (possible pneumonia)",
        "Cough in a known TB contact",
      ],
      referralAdvice: "Productive cough with high fever, difficulty breathing, or cough lasting 3+ weeks requires medical evaluation.",
    },
  },
  {
    keywords: ["pain", "headache", "ache", "sore", "hurt", "arthritis"],
    result: {
      symptomSummary: "Pain Management",
      drugCategories: [
        {
          category: "Simple Analgesics",
          rationale: "First-line for mild to moderate pain",
          examples: ["Paracetamol 500mg–1000mg", "Ibuprofen 400mg"],
          notes: "WHO pain ladder: start with simple analgesics before escalating.",
        },
        {
          category: "NSAIDs",
          rationale: "For inflammatory pain (arthritis, dental pain, dysmenorrhoea)",
          examples: ["Ibuprofen", "Diclofenac", "Naproxen"],
          notes: "Take with food. Avoid in renal impairment, peptic ulcer, or pregnancy (third trimester).",
        },
        {
          category: "Topical Analgesics",
          rationale: "For localised musculoskeletal pain",
          examples: ["Diclofenac gel", "Ibuprofen cream", "Voltaren gel"],
        },
      ],
      redFlags: [
        "Sudden severe headache ('thunderclap') — possible subarachnoid haemorrhage",
        "Chest pain radiating to arm, jaw, or back",
        "Headache with visual disturbance or neurological signs",
        "Pain not responding to OTC analgesics after 48–72 hours",
        "Fever accompanying severe localised pain",
      ],
      referralAdvice: "Severe or worsening pain, or pain with systemic symptoms, requires a medical assessment.",
    },
  },
  {
    keywords: ["diarrhea", "diarrhoea", "vomiting", "stomach", "nausea", "gastro", "gut"],
    result: {
      symptomSummary: "Gastrointestinal Symptoms",
      drugCategories: [
        {
          category: "Oral Rehydration Therapy (ORT)",
          rationale: "Primary treatment for diarrhoea with dehydration — especially in children",
          examples: ["ORS (WHO formula)", "Pedialyte", "Dioralyte"],
          notes: "ORT is the most important intervention. Prevent dehydration before it becomes severe.",
        },
        {
          category: "Antidiarrhoeals",
          rationale: "Symptomatic relief in non-infective diarrhoea",
          examples: ["Loperamide (Imodium)", "Bismuth subsalicylate"],
          notes: "Do not use in children under 2. Avoid if fever or bloody stool suggests infective cause.",
        },
        {
          category: "Antiemetics",
          rationale: "For nausea and vomiting",
          examples: ["Metoclopramide", "Domperidone", "Promethazine"],
          notes: "Avoid metoclopramide in young children due to extrapyramidal effects.",
        },
      ],
      redFlags: [
        "Bloody diarrhoea or black stool",
        "Diarrhoea with fever > 38.5°C",
        "Signs of severe dehydration (sunken eyes, no urine output, skin tenting)",
        "Vomiting blood or coffee-ground material",
        "Persistent vomiting preventing oral hydration",
      ],
      referralAdvice: "Severe dehydration, bloody stool, persistent high fever with GI symptoms — refer urgently.",
    },
  },
];

export default function ClinicalSupportPage() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!symptoms.trim()) return;
    setIsLoading(true);
    setSearched(false);

    await new Promise((r) => setTimeout(r, 600));

    const query = symptoms.toLowerCase();
    const match = SYMPTOM_MAP.find((entry) =>
      entry.keywords.some((kw) => query.includes(kw))
    );

    setResult(match?.result ?? null);
    setSearched(true);
    setIsLoading(false);
  };

  const exampleSymptoms = [
    "Fever and chills",
    "Cough and cold",
    "Headache and body pain",
    "Diarrhea and vomiting",
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-primary" />
          Clinical Decision Support
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Assistive symptom-to-drug-category guidance for licensed pharmacy practitioners.
        </p>
      </div>

      {/* Strong Disclaimer */}
      <div className="flex items-start gap-3 p-5 rounded-xl bg-red-50 border-2 border-red-200 mb-6">
        <ShieldAlert className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-800 mb-1">
            IMPORTANT — Read Before Using This Tool
          </p>
          <ul className="text-xs text-red-700 space-y-1 leading-relaxed">
            <li>• This is a <strong>reference support tool for licensed pharmacy staff only</strong> — not a prescribing system.</li>
            <li>• It does NOT diagnose conditions or prescribe medications.</li>
            <li>• Drug suggestions are drug <strong>categories</strong> — the specific selection requires clinical judgement.</li>
            <li>• Always refer patients requiring prescription drugs to a qualified prescriber.</li>
            <li>• In case of emergency or red flag symptoms, advise the patient to seek immediate medical care.</li>
          </ul>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium text-foreground">
          Describe the patient's reported symptoms
        </label>
        <Textarea
          placeholder="e.g. Patient reports fever for 2 days, headache, and loss of appetite. No known medical history."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-muted-foreground self-center">Quick examples:</span>
        {exampleSymptoms.map((s) => (
          <Button
            key={s}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setSymptoms(s)}
          >
            {s}
          </Button>
        ))}
      </div>

      <Button onClick={handleSearch} disabled={isLoading || !symptoms.trim()} className="mb-6">
        {isLoading ? (
          <><RefreshCw className="w-4 h-4 animate-spin" /> Analysing…</>
        ) : (
          <><ArrowRight className="w-4 h-4" /> Get Drug Category Guidance</>
        )}
      </Button>

      {/* No result */}
      {searched && !result && (
        <div className="text-center py-12 text-muted-foreground">
          <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium">No matching guidance found</p>
          <p className="text-sm mt-1 max-w-sm mx-auto">
            This tool covers common presentations. For complex or unusual cases, please consult a medical professional.
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Guidance for: {result.symptomSummary}</h2>
            <Badge variant="info">Reference Only</Badge>
          </div>

          {/* Drug Categories */}
          <div className="space-y-3">
            {result.drugCategories.map((cat, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    {cat.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <p className="text-xs text-muted-foreground">{cat.rationale}</p>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-1">Drug examples:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.examples.map((ex) => (
                        <Badge key={ex} variant="secondary" className="text-xs">{ex}</Badge>
                      ))}
                    </div>
                  </div>
                  {cat.notes && (
                    <div className="flex items-start gap-2 p-2.5 bg-blue-50 rounded-lg border border-blue-100 mt-2">
                      <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-800">{cat.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Red Flags */}
          <Card className="border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                Red Flag Symptoms — Refer Immediately
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {result.redFlags.map((flag) => (
                  <li key={flag} className="flex items-start gap-2 text-sm text-red-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Referral */}
          {result.referralAdvice && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-800"><strong>Referral Guidance:</strong> {result.referralAdvice}</p>
            </div>
          )}

          <Separator />
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            This guidance is for educational and operational reference only. DrugSmart does not prescribe or diagnose.
            The dispensing pharmacist bears full professional responsibility for any therapeutic decision.
          </p>
        </div>
      )}
    </div>
  );
}
