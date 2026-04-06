"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { properties } from "@/api";
import { CreatePropertySchema } from "@repo/shared/schemas";
import type { PropertyListingType } from "@/api/types";

type FormState = {
  name: string;
  listingType: PropertyListingType;
  bhk: string;
  city: string;
  contact: string;
  price: string;
  description: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  name: "",
  listingType: "sell",
  bhk: "1",
  city: "",
  contact: "",
  price: "",
  description: "",
};

export function CreatePropertyForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated once session resolves
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/");
    }
  }, [isPending, session, router]);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setFieldErrors({});

    // Client-side validation using the shared Zod schema
    const parsed = CreatePropertySchema.safeParse({
      name: form.name.trim(),
      listingType: form.listingType,
      bhk: Number(form.bhk),
      city: form.city.trim(),
      contact: form.contact.trim(),
      price: form.price.trim() || undefined,
      description: form.description.trim() || undefined,
    });

    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormState;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await properties.create(parsed.data);
      setSuccess(true);
      setForm(INITIAL_STATE);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      // Surface 401/403 meaningfully
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosErr.response?.status === 401) {
          setServerError("You must be signed in to post a property.");
          return;
        }
        if (axiosErr.response?.status === 403) {
          setServerError("Your account is not permitted to post listings.");
          return;
        }
        if (axiosErr.response?.data?.error) {
          setServerError(axiosErr.response.data.error);
          return;
        }
      }
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
        <h2 className="text-xl font-semibold text-emerald-800">Property listed!</h2>
        <p className="mt-1 text-sm text-emerald-700">
          Your listing is live. Interested buyers/renters can request your contact.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="rounded-lg border border-emerald-300 px-5 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            Post another
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Browse listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      {/* Listing type toggle */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-gray-700">
          Listing type <span className="text-red-500">*</span>
        </legend>
        <div className="flex gap-3">
          {(["sell", "rent"] as PropertyListingType[]).map((type) => (
            <label
              key={type}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                form.listingType === type
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="listingType"
                value={type}
                checked={form.listingType === type}
                onChange={() => set("listingType", type)}
                className="sr-only"
              />
              {type === "sell" ? "For Sale" : "For Rent"}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Property title */}
      <Field
        id="name"
        label="Property title"
        required
        error={fieldErrors.name}
        hint='e.g. "Spacious 2BHK near Indiranagar metro"'
      >
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Sunny 2BHK in Koramangala"
          maxLength={100}
          className={inputCls(!!fieldErrors.name)}
        />
      </Field>

      {/* BHK + City row */}
      <div className="grid grid-cols-2 gap-4">
        <Field id="bhk" label="BHK" required error={fieldErrors.bhk}>
          <select
            id="bhk"
            value={form.bhk}
            onChange={(e) => set("bhk", e.target.value)}
            className={inputCls(!!fieldErrors.bhk)}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n} BHK
              </option>
            ))}
          </select>
        </Field>

        <Field id="city" label="City" required error={fieldErrors.city}>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Bengaluru"
            maxLength={100}
            className={inputCls(!!fieldErrors.city)}
          />
        </Field>
      </div>

      {/* Price (optional) */}
      <Field
        id="price"
        label="Price / Rent"
        error={fieldErrors.price}
        hint='e.g. "45 Lakhs" or "₹25,000 / month"'
      >
        <input
          id="price"
          type="text"
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          placeholder="Optional"
          maxLength={50}
          className={inputCls(!!fieldErrors.price)}
        />
      </Field>

      {/* Description (optional) */}
      <Field
        id="description"
        label="Description"
        error={fieldErrors.description}
        hint="Up to 1000 characters"
      >
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Describe the property — nearby amenities, furnishing, facing, etc."
          maxLength={1000}
          rows={4}
          className={inputCls(!!fieldErrors.description)}
        />
      </Field>

      {/* Contact */}
      <Field
        id="contact"
        label="Your contact number"
        required
        error={fieldErrors.contact}
        hint="Hidden from listings — only revealed to verified users on request."
      >
        <input
          id="contact"
          type="tel"
          value={form.contact}
          onChange={(e) => set("contact", e.target.value)}
          placeholder="+91 98765 43210"
          maxLength={20}
          className={inputCls(!!fieldErrors.contact)}
        />
      </Field>

      {/* Server error */}
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </span>
        ) : (
          "Post Listing"
        )}
      </button>
    </form>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return `w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
    hasError
      ? "border-red-400 bg-red-50 placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
  }`;
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
}
