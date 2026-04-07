"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle2,
  Home,
  IndianRupee,
  Loader2,
  MapPin,
  Phone,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { properties } from "@/api";
import { CreatePropertySchema, type CreateProperty } from "@repo/shared/schemas";

const BHK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function CreatePropertyForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const form = useForm<CreateProperty>({
    resolver: zodResolver(CreatePropertySchema),
    defaultValues: {
      listingType: "sell",
      bhk: 1,
      name: "",
      city: "",
      contact: "",
      price: "",
      description: "",
    },
  });

  const listingType = form.watch("listingType");
  const { isSubmitting, isSubmitSuccessful } = form.formState;

  // Guard: redirect unauthenticated users once session resolves
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/");
    }
  }, [isPending, session, router]);

  async function onSubmit(data: CreateProperty) {
    try {
      await properties.create(data);
      toast.success("Property listed successfully!", {
        description: "Interested buyers/renters can now request your contact.",
      });
      form.reset();
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { status?: number; data?: { error?: string } };
      };

      if (apiErr.response?.status === 401) {
        toast.error("Authentication required", {
          description: "You must be signed in to post a property.",
        });
        return;
      }
      if (apiErr.response?.status === 403) {
        toast.error("Permission denied", {
          description: "Your account is not permitted to post listings.",
        });
        return;
      }
      const message = apiErr.response?.data?.error ?? "Something went wrong. Please try again.";
      toast.error("Failed to post listing", { description: message });
    }
  }

  // ── Loading state ───────────────────────────────────────────────────────────

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ── Success state ───────────────────────────────────────────────────────────

  if (isSubmitSuccessful && !isSubmitting) {
    return (
      <Card  className="border-emerald-200 bg-emerald-50 shadow-md ">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <CheckCircle2 className="mb-4 h-14 w-14 text-emerald-500" />
          <h2 className="text-xl font-semibold text-emerald-800">Property listed!</h2>
          <p className="mt-1.5 max-w-xs text-sm text-emerald-700">
            Your listing is live. Interested buyers/renters can request your contact.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              onClick={() => form.reset({ listingType: "sell", bhk: 1, name: "", city: "", contact: "", price: "", description: "" })}
            >
              Post another listing
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => router.push("/")}
            >
              Browse listings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-indigo-600" />
          New property listing
        </CardTitle>
        <CardDescription>
          Fill in the details below. Your contact number stays hidden until a verified user requests it.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">

            {/* ── Listing type ───────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="listingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" />
                    Listing type
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-3">
                      {(["sell", "rent"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => field.onChange(type)}
                          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                            listingType === type
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-input bg-background text-muted-foreground hover:border-muted-foreground"
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
                            <Badge className="ml-1 h-4 px-1 py-0 text-[10px] bg-indigo-600">
                              Selected
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* ── Property title ─────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    Property title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g. "Spacious 2BHK near Indiranagar metro"'
                      maxLength={100}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>Between 3 and 100 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── BHK + City ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="bhk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BHK</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select BHK" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BHK_OPTIONS.map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} BHK
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      City
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Bengaluru"
                        maxLength={100}
                        autoComplete="address-level2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ── Price ──────────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5" />
                    Price / Rent
                    <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g. "45 Lakhs" or "₹25,000 / month"'
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Description ────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                    <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nearby amenities, furnishing, facing direction, parking…"
                      maxLength={1000}
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    {(field.value?.length ?? 0)} / 1000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* ── Contact ────────────────────────────────────────────────────── */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Your contact number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="+91 98765 43210"
                      maxLength={20}
                      autoComplete="tel"
                    />
                  </FormControl>
                  <FormDescription>
                    Hidden from listings — only revealed to verified users on request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Submit ─────────────────────────────────────────────────────── */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Post Listing"
              )}
            </Button>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
