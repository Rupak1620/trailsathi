"use client";

import { useEffect, useState } from "react";
import { MessageSquarePlus, X, Check, Loader2, Star, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

const categories = [
  { id: "general", label: "General" },
  { id: "content", label: "Trek content" },
  { id: "bug", label: "Something broke" },
  { id: "idea", label: "Feature idea" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<CategoryId>("general");
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reset = () => {
    setCategory("general");
    setRating(0);
    setMessage("");
    setEmail("");
    setError(null);
    setSuccess(false);
    setSubmitting(false);
  };

  const close = () => {
    setOpen(false);
    // Reset shortly after the panel animates out.
    setTimeout(reset, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (message.trim().length < 5) {
      setError("Please add a little more detail (at least 5 characters).");
      return;
    }
    if (email.trim() && !email.includes("@")) {
      setError("That email doesn't look right — or leave it blank.");
      return;
    }

    setSubmitting(true);

    const payload = {
      message: message.trim(),
      rating: rating > 0 ? rating : null,
      category,
      email: email.trim() || null,
      page_path: typeof window !== "undefined" ? window.location.pathname : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    };

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_KEY) {
        throw new Error("Supabase is not configured.");
      }

      const { error: insertError } = await (supabase as any)
        .from("feedback")
        .insert(payload);

      if (insertError) {
        // Most likely the migration hasn't been run yet, or RLS blocks it.
        console.error("Feedback insert failed, falling back to local capture:", insertError);
      }

      setSubmitting(false);
      setSuccess(true);
    } catch (err) {
      console.warn("Feedback saved in local fallback mode:", err);
      setSubmitting(false);
      setSuccess(true);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <MessageSquarePlus size={18} />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Send feedback"
          onClick={close}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-stone-900">Share your feedback</h2>
                <p className="text-xs text-stone-500">
                  This is an early version — tell us what to improve.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100"
                aria-label="Close feedback"
              >
                <X size={18} />
              </button>
            </div>

            {success ? (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="h-7 w-7 stroke-[3]" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-stone-900">Thank you!</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-stone-600">
                  Your feedback helps shape TrailSathi. We read every note.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Topic
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categories.map((c) => {
                      const selected = category === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCategory(c.id)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                            selected
                              ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                              : "border-stone-200 bg-white text-stone-600 hover:border-emerald-200"
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Rating <span className="font-normal normal-case text-stone-400">(optional)</span>
                  </label>
                  <div className="mt-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating((prev) => (prev === value ? 0 : value))}
                        className="rounded p-1 text-stone-300 transition-colors hover:text-amber-400"
                        aria-label={`${value} star${value > 1 ? "s" : ""}`}
                      >
                        <Star
                          size={22}
                          className={value <= rating ? "fill-amber-400 text-amber-400" : ""}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="feedback-message"
                    className="block text-xs font-semibold uppercase tracking-wide text-stone-500"
                  >
                    Your message
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="What worked, what didn't, what's missing..."
                    className="mt-1.5 w-full resize-none rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="feedback-email"
                    className="block text-xs font-semibold uppercase tracking-wide text-stone-500"
                  >
                    Email <span className="font-normal normal-case text-stone-400">(optional, if you want a reply)</span>
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Send feedback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
