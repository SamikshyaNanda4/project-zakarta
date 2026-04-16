"use client";

import { Building2, CheckCircle2, Home, IndianRupee, Loader2 } from "lucide-react";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { Form } from "@repo/ui/components/ui/form";
import { useRouter } from "next/navigation";

import { usePropertyForm } from "./hooks/usePropertyForm";
import { Section1Locality } from "./sections/Section1Locality";
import { Section2About } from "./sections/Section2About";
import { Section3Pricing } from "./sections/Section3Pricing";
import { Section4Amenities } from "./sections/Section4Amenities";
import { Section5Additional } from "./sections/Section5Additional";
import { SectionGallery } from "./sections/SectionGallery";

export function CreatePropertyForm() {
  const router = useRouter();
  const {
    form,
    isSell,
    listingType,
    homeType,
    monthlyMaintenanceExtra,
    sectionStatus,
    setSectionStatus,
    localityList,
    loadingLocalities,
    isSubmitting,
    isSuccess,
    saveSection,
    expandSection,
    resetForm,
    onSubmit,
    section1Fields,
    s2Fields,
    s3Fields,
    section4Fields,
    s5Fields,
    isPending,
  } = usePropertyForm();

  // ── Loading state ────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <Card className="border-emerald-200 bg-emerald-50 shadow-md">
        <CardContent className="flex flex-col items-center py-14 text-center">
          <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-500" />
          <h2 className="text-2xl font-bold text-emerald-800">Property Listed!</h2>
          <p className="mt-2 max-w-sm text-sm text-emerald-700">
            Your listing is live. Interested buyers/renters will request your contact.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              onClick={resetForm}
            >
              Post another listing
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => router.push("/")}
            >
              Browse listings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Sale / Rent selector ───────────────────────────────────────────── */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Post Your Property
          </CardTitle>
          <CardDescription>
            Fill each section and save it. Post your property when all sections are complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(["sell", "rent"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => form.setValue("listingType", type)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  listingType === type
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-input bg-background text-muted-foreground hover:border-emerald-200"
                }`}
              >
                {type === "sell" ? (
                  <>
                    <Home className="h-4 w-4" />
                    For Sale
                  </>
                ) : (
                  <>
                    <IndianRupee className="h-4 w-4" />
                    For Rent
                  </>
                )}
                {listingType === type && (
                  <Badge className="ml-1 bg-emerald-600 text-[10px] h-4 px-1.5">Active</Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Sections ────────────────────────────────────────────────────────── */}
      <Form {...form}>
        <form noValidate className="space-y-3">

          <Section1Locality
            form={form}
            status={sectionStatus[0]!}
            onExpand={() => expandSection(0)}
            onSave={() => saveSection(0, section1Fields)}
            localityList={localityList}
            loadingLocalities={loadingLocalities}
          />

          <Section2About
            form={form}
            status={sectionStatus[1]!}
            onExpand={() => expandSection(1)}
            onSave={() => saveSection(1, s2Fields)}
            isSell={isSell}
            homeType={homeType}
          />

          <Section3Pricing
            form={form}
            status={sectionStatus[2]!}
            onExpand={() => expandSection(2)}
            onSave={() => saveSection(2, s3Fields)}
            isSell={isSell}
            monthlyMaintenanceExtra={monthlyMaintenanceExtra}
          />

          <Section4Amenities
            form={form}
            status={sectionStatus[3]!}
            onExpand={() => expandSection(3)}
            onSave={() => saveSection(3, section4Fields)}
            isSell={isSell}
          />

          {/* Section 5: Additional (sell) or straight to Gallery (rent) */}
          {isSell && (
            <Section5Additional
              form={form}
              status={sectionStatus[4]!}
              onExpand={() => expandSection(4)}
              onSave={() => saveSection(4, s5Fields)}
              homeType={homeType}
            />
          )}

          <SectionGallery
            number={isSell ? 6 : 5}
            status={sectionStatus[isSell ? 5 : 4]!}
            onExpand={() => expandSection(isSell ? 5 : 4)}
            setSectionStatus={setSectionStatus}
            sectionIndex={isSell ? 5 : 4}
            nextIndex={isSell ? 6 : 5}
            isSell={isSell}
          />

          {/* ── Submit ─────────────────────────────────────────────────────── */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-base font-semibold py-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Posting your property…
                </>
              ) : (
                <>
                  <Home className="h-5 w-5" />
                  Post Your Property
                </>
              )}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Your contact stays hidden until a verified user requests it.
            </p>
          </div>

        </form>
      </Form>
    </div>
  );
}