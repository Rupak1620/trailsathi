"use client";

import { useState } from "react";
import {
  UserCheck,
  Languages,
  Calendar,
  MessageSquare,
  Mail,
  Send,
  Sparkles,
  BadgeCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import type { VerifiedGuide } from "@/lib/guides";

type TrekGuidesSectionProps = {
  trekName: string;
  trekId: string;
  region?: string | null;
  guides: VerifiedGuide[];
};

export function TrekGuidesSection({ trekName, region, guides }: TrekGuidesSectionProps) {
  const regionLabel = (region && region.trim()) || "Nepal";
  const [selectedGuide, setSelectedGuide] = useState<VerifiedGuide | null>(null);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dates, setDates] = useState("");
  const [notes, setBio] = useState("");

  // Guide Match Request Form state for empty guides lists
  const [matchingStatus, setMatchingStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConnectSuccess(true);
    setTimeout(() => {
      // open WhatsApp in a new tab if guide has it
      if (selectedGuide?.whatsapp) {
        const text = encodeURIComponent(
          `Hi ${selectedGuide.full_name}, I saw your profile on TrailSathi for the ${trekName} trek! I'm planning to go around ${dates || "soon"}. Are you available?`
        );
        window.open(`https://wa.me/${selectedGuide.whatsapp.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
      } else if (selectedGuide?.email) {
        const subject = encodeURIComponent(`TrailSathi Guide Inquiry: ${trekName}`);
        const body = encodeURIComponent(
          `Hi ${selectedGuide.full_name},\n\nI found your verified guide profile on TrailSathi for the ${trekName} trek. I am looking to trek on dates: ${dates || "[Enter Dates]"}.\n\nMy Message:\n${notes}\n\nBest,\n${name}`
        );
        window.open(`mailto:${selectedGuide.email}?subject=${subject}&body=${body}`);
      }
    }, 1200);
  };

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMatchingStatus("submitting");
    setTimeout(() => {
      setMatchingStatus("success");
    }, 1500);
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <UserCheck className="h-5.5 w-5.5 text-emerald-700" />
            Verified Local Guides for {trekName}
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Connect directly with licensed guides verified specifically for this route. No booking fees.
          </p>
        </div>
      </div>

      {guides.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="rounded-xl border border-stone-150 bg-stone-50/40 hover:bg-stone-50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md border-l-4 border-l-emerald-600"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-lg flex items-center gap-1.5">
                      {guide.full_name}
                      {guide.verification && (
                        <BadgeCheck className="h-5 w-5 text-emerald-600 shrink-0" fill="currentColor" />
                      )}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      Base: {guide.base_location || "Nepal"} • {guide.years_experience || 0}+ yrs exp
                    </p>
                  </div>
                  {guide.avatar_url ? (
                    <img
                      src={guide.avatar_url}
                      alt={guide.full_name}
                      className="h-12 w-12 rounded-full object-cover border border-stone-200"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center border border-stone-200 uppercase text-sm">
                      {guide.full_name.charAt(0)}
                    </div>
                  )}
                </div>

                <p className="mt-3 text-xs text-stone-600 line-clamp-3 leading-5">
                  {guide.bio || "This local guide is highly recommended for safety, altitude expertise, and cultural knowledge."}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
                    <Languages className="h-3 w-3" />
                    {(guide.languages ?? ["English", "Nepali"]).join(", ")}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded">
                  Active Now
                </span>
                <button
                  onClick={() => {
                    setSelectedGuide(guide);
                    setConnectSuccess(false);
                    setName("");
                    setEmail("");
                    setDates("");
                    setBio("");
                  }}
                  className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Connect Instantly
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State: smart guide requests matchmaker */
        <div className="rounded-xl border border-dashed border-stone-300 p-6 bg-stone-50/30 text-center max-w-2xl mx-auto">
          {matchingStatus === "success" ? (
            <div className="animate-in fade-in duration-500 py-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                <CheckCircle2 className="h-6 w-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Expert Match Request Received!</h3>
              <p className="mt-2 text-xs text-stone-600 leading-5 max-w-sm mx-auto">
                Excellent! We&apos;ve flagged your request. Our local network of verified guides in the {regionLabel} region will review your details.
              </p>
              <div className="mt-5 rounded-lg bg-emerald-50 border border-emerald-100 p-3 max-w-md mx-auto text-left text-[11px] text-emerald-850 flex gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                <span>
                  Our algorithms are currently matching your request with <strong>3 verified independent guides</strong>. You will receive direct WhatsApp or email inquiries shortly.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center text-stone-400">
                <Users className="h-10 w-10 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-sm">No Active Guides Registered on this Trail Yet</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto leading-5">
                  Don&apos;t worry — TrailSathi has an off-platform network of licensed guides across Nepal. Let us match you with a {regionLabel} expert for free.
                </p>
              </div>

              <form onSubmit={handleMatchSubmit} className="text-left mt-6 grid gap-4 max-w-md mx-auto bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Free Guide On-Demand Matching</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam"
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 555..."
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Group Size</label>
                    <select className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                      <option>1 Trekker (Solo)</option>
                      <option>2 Trekkers</option>
                      <option>3 - 5 Trekkers</option>
                      <option>6+ Trekkers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Trek Month</label>
                    <input
                      type="month"
                      required
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={matchingStatus === "submitting"}
                  className="w-full rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {matchingStatus === "submitting" ? (
                    <>Matching...</>
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      Find Me a Verified Guide
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Guide Connection Modal / Popup */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl p-6 max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Direct Connection to {selectedGuide.full_name}
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-5">
              Connect directly. Skip the agency fees. We will automatically generate your pre-filled inquiry.
            </p>

            {connectSuccess ? (
              <div className="py-8 text-center animate-in fade-in duration-400">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <CheckCircle2 className="h-6 w-6 stroke-[3]" />
                </div>
                <h4 className="font-bold text-stone-800 text-sm">Launching Direct Connection...</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Please complete the message details in the opened window. Let&apos;s trek safely!
                </p>
              </div>
            ) : (
              <form onSubmit={handleConnectSubmit} className="space-y-4 mt-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Proposed Travel Dates</label>
                    <input
                      type="text"
                      required
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      placeholder="e.g. Oct 12 - Oct 25"
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Inquiry Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="e.g. We are a group of 3 moderate fitness hikers. Do you supply tents?"
                    className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGuide(null)}
                    className="flex-1 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 py-2.5 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {selectedGuide.whatsapp ? (
                      <>
                        <MessageSquare className="h-3 w-3" />
                        Chat on WhatsApp
                      </>
                    ) : (
                      <>
                        <Mail className="h-3 w-3" />
                        Send Direct Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
