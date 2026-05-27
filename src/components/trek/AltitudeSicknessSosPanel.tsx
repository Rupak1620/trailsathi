"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Heart,
  PhoneCall,
  Navigation,
  FileText,
  CheckCircle,
  Share2,
  Sparkles,
  Activity,
} from "lucide-react";

type AltitudeSicknessSosPanelProps = {
  trekName: string;
  region: string;
};

// Lake Louise Scoring questions for AMS diagnosis
const symptoms = [
  {
    id: "headache",
    label: "Headache Severity",
    options: [
      { score: 0, label: "None / No headache" },
      { score: 1, label: "Mild headache" },
      { score: 2, label: "Moderate headache" },
      { score: 3, label: "Severe, incapacitating headache" },
    ],
  },
  {
    id: "gastro",
    label: "Gastrointestinal Symptoms",
    options: [
      { score: 0, label: "Good appetite / None" },
      { score: 1, label: "Poor appetite or mild nausea" },
      { score: 2, label: "Moderate nausea or vomiting" },
      { score: 3, label: "Severe, incapacitating nausea and vomiting" },
    ],
  },
  {
    id: "fatigue",
    label: "Fatigue and/or Weakness",
    options: [
      { score: 0, label: "Not tired or weak" },
      { score: 1, label: "Mild fatigue/weakness" },
      { score: 2, label: "Moderate fatigue/weakness" },
      { score: 3, label: "Severe fatigue/weakness, struggle to walk" },
    ],
  },
  {
    id: "dizziness",
    label: "Dizziness and/or Lightheadedness",
    options: [
      { score: 0, label: "None / Perfectly steady" },
      { score: 1, label: "Mild dizziness" },
      { score: 2, label: "Moderate dizziness" },
      { score: 3, label: "Severe dizziness, loss of balance / ataxia" },
    ],
  },
  {
    id: "sleep",
    label: "Sleep Quality (Last Night)",
    options: [
      { score: 0, label: "Slept as well as usual" },
      { score: 1, label: "Did not sleep as well as usual" },
      { score: 2, label: "Woke many times, poor sleep" },
      { score: 3, label: "Could not sleep at all" },
    ],
  },
];

export function AltitudeSicknessSosPanel({ trekName, region }: AltitudeSicknessSosPanelProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({
    headache: 0,
    gastro: 0,
    fatigue: 0,
    dizziness: 0,
    sleep: 0,
  });

  const [calcScore, setCalcScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleOptionChange = (symId: string, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [symId]: score,
    }));
    setCalcScore(null); // Reset calculated screen on change
  };

  const runDiagnosis = () => {
    const total = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    setCalcScore(total);
  };

  const getDiagnosisReport = (score: number) => {
    const hasHeadache = answers.headache > 0;

    if (!hasHeadache) {
      return {
        severity: "No AMS",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        message: "No clinical diagnosis of Acute Mountain Sickness (AMS). Headaches are required for an AMS diagnosis under the Lake Louise criteria. Maintain hydration and keep monitoring.",
        action: "Continue your trek as planned. Avoid alcohol, keep drinking fluids (3-4L daily), and maintain a slow, steady ascent pace (~300-500m per day max above 3000m).",
      };
    }

    if (score >= 1 && score <= 2) {
      return {
        severity: "Very Mild Altitude Effects",
        color: "text-stone-700 bg-stone-50 border-stone-200",
        message: "You have a mild headache but minimal other symptoms. This is common during acclimatization.",
        action: "Do not climb higher today. Take rest, hydrate, and consider standard ibuprofen/paracetamol. If symptoms resolve tomorrow, you may proceed slowly.",
      };
    }

    if (score >= 3 && score <= 5) {
      return {
        severity: "Mild to Moderate AMS",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        message: "Your Lake Louise Score is indicative of Mild-to-Moderate Acute Mountain Sickness. Your body is struggling to acclimate to this altitude.",
        action: "MANDATORY REST. Do NOT ascend under any circumstances. Spend an extra night at this altitude. Consider taking Acetazolamide (Diamox) if prescribed. If symptoms worsen, descend immediately.",
      };
    }

    return {
      severity: "Severe AMS / HAPE Warning",
      color: "text-red-700 bg-red-50 border-red-200 animate-pulse",
      message: "WARNING: High Lake Louise Score indicative of severe Acute Mountain Sickness. High risk of transitioning into life-threatening HAPE or HACE.",
      action: "IMMEDIATE DESCENT REQUIRED. Climb down at least 500-1000m vertical meters immediately, even if it is night time. Administer oxygen if available. Call emergency helicopter dispatch or local rescue teams.",
    };
  };

  const report = calcScore !== null ? getDiagnosisReport(calcScore) : null;

  // Preformatted text for Satellite messenger (e.g. Garmin InReach / SPOT)
  const getSatelliteSms = () => {
    const total = calcScore || 0;
    return `TRAILSATHI EMERGENCY ALERT
Trek: ${trekName}
Region: ${region}
Lake Louise AMS Score: ${total}/15
Symptoms: H:${answers.headache} G:${answers.gastro} F:${answers.fatigue} D:${answers.dizziness} S:${answers.sleep}
Status: ${report ? report.severity : "Assessment pending"}
Coordinates: [GPS Coordinates here]`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getSatelliteSms());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <ShieldAlert className="h-5.5 w-5.5 text-rose-600 shrink-0" />
            AMS Emergency Diagnosis &amp; SOS Guide
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Grounded on the clinical **Lake Louise scoring system** used by medical professionals globally. Check your symptoms below.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-100 shrink-0 self-start sm:self-auto">
          <Heart className="h-3.5 w-3.5 fill-current text-rose-600" />
          <span>Life-saving Protocol</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        {/* Symptom Assessment form */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Symptom Assessment</h3>

          {symptoms.map((s) => (
            <div key={s.id} className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">{s.label}</label>
              <select
                value={answers[s.id]}
                onChange={(e) => handleOptionChange(s.id, Number(e.target.value))}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {s.options.map((opt) => (
                  <option key={opt.score} value={opt.score}>
                    Score {opt.score}: {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={runDiagnosis}
            className="w-full mt-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-white py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Activity className="h-4 w-4 text-emerald-500" />
            Calculate Lake Louise Diagnosis
          </button>
        </div>

        {/* Diagnosis report & emergency info */}
        <div className="rounded-xl border border-stone-200 p-5 bg-stone-50/50 flex flex-col justify-between">
          {report ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className={`p-4 rounded-xl border flex gap-3 items-start ${report.color}`}>
                <AlertTriangle className="h-5.5 w-5.5 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">Clinical Report: {report.severity}</span>
                  <span className="text-[10px] font-bold block mt-0.5">Total Score: {calcScore} / 15</span>
                  <p className="text-xs mt-2 leading-5 font-medium opacity-90">{report.message}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">MANDATORY PROTOCOL:</span>
                <p className="text-xs font-bold text-stone-800 leading-6 mt-1.5">{report.action}</p>
              </div>

              {/* Satellite / Offline share helper */}
              <div className="border-t border-stone-200 pt-4 mt-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                    <Navigation className="h-3 w-3 text-stone-500" />
                    Offline Satellite SMS Format
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-white px-2 py-1 rounded border border-stone-200"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3 w-3" />
                        Copy SMS
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-[10px] font-mono p-3 bg-stone-900 text-stone-100 rounded-lg overflow-x-auto leading-4">
                  {getSatelliteSms()}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 h-full text-stone-500">
              <FileText className="h-10 w-10 text-stone-300 stroke-[1.5] mb-2" />
              <p className="text-xs font-bold text-stone-700">Diagnosis Pending</p>
              <p className="text-[11px] text-stone-400 mt-1 max-w-xs leading-4">
                Fill out the symptom severity checklist on the left and click &quot;Calculate Lake Louise Diagnosis&quot; to inspect clinical safety protocol.
              </p>
            </div>
          )}

          {/* Emergency contacts always visible */}
          <div className="border-t border-stone-150 pt-4 mt-4">
            <h4 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-rose-600" />
              Emergency Helplines &amp; Rescue
            </h4>
            <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-stone-600">
              <div className="bg-white p-2.5 rounded-lg border border-stone-150/65">
                <span className="font-bold text-stone-800 block">Tourist Police Nepal</span>
                <a href="tel:+97714247041" className="text-emerald-700 hover:underline font-semibold font-mono mt-0.5 block">+977-1-4247041</a>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-150/65">
                <span className="font-bold text-stone-800 block">Heli Evac Dispatch</span>
                <a href="tel:1144" className="text-emerald-700 hover:underline font-semibold font-mono mt-0.5 block">1144 (Nepal Hotline)</a>
              </div>
            </div>
            <div className="text-[9px] text-stone-400 mt-2 leading-4">
              * Helicopter rescues in Nepal require credit card details or insurance guarantee documents. Keep a digital copy on your offline device.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
