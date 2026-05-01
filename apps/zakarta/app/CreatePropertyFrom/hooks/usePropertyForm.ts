"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { properties, localities } from "@/api";
import type { Locality, CreateSellPropertyBody, CreateRentPropertyBody } from "@/api";

import {
  FormSchema,
  type FormValues,
  type SectionStatus,
  defaultFormValues,
  section1Fields,
  getSection2Fields,
  section3FieldsSell,
  section3FieldsRent,
  section4Fields,
  getSection5Fields,
} from "../schema";

export function usePropertyForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema) as Resolver<FormValues>,
    defaultValues: defaultFormValues,
  });

  const listingType = form.watch("listingType");
  const area = form.watch("area");
  const homeType = form.watch("homeType");
  const monthlyMaintenanceExtra = form.watch("monthlyMaintenanceExtra");

  const isSell = listingType === "sell";

  const [sectionStatus, setSectionStatus] = useState<SectionStatus[]>([
    "active",   // 0: Locality
    "pending",  // 1: About Property
    "pending",  // 2: Sale/Rent Details
    "pending",  // 3: Amenities
    "pending",  // 4: Additional Info (sell) / Gallery (rent)
    "pending",  // 5: Gallery (sell only)
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [localityList, setLocalityList] = useState<Locality[]>([]);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch localities when area changes
  useEffect(() => {
    if (!area) return;
    setLoadingLocalities(true);
    form.setValue("localityId", "");
    localities
      .list(area as "Bhubaneswar" | "Cuttack" | "Puri")
      .then((res) => setLocalityList(res.localities))
      .catch(() => toast.error("Failed to load localities"))
      .finally(() => setLoadingLocalities(false));
  }, [area, form]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/");
  }, [isPending, session, router]);

  // Reset section status when listing type changes
  useEffect(() => {
    setSectionStatus(["active", "pending", "pending", "pending", "pending", "pending"]);
    setActiveIdx(0);
  }, [listingType]);

  const saveSection = useCallback(
    async (idx: number, fields: (keyof FormValues)[]) => {
      const valid = await form.trigger(fields);
      if (!valid) return;
      setSectionStatus((prev) => {
        const next = [...prev];
        next[idx] = "saved";
        if (idx + 1 < next.length) next[idx + 1] = "active";
        return next;
      });
      setActiveIdx(idx + 1);
    },
    [form]
  );

  const expandSection = useCallback((idx: number) => {
    setSectionStatus((prev) => {
      const next = [...prev];
      for (let i = 0; i < next.length; i++) {
        if (next[i] === "active" && i !== idx) next[i] = "saved";
      }
      next[idx] = "active";
      return next;
    });
    setActiveIdx(idx);
  }, []);

  const markGallerySaved = useCallback(() => {
    setSectionStatus((prev) => {
      const next = [...prev];
      const idx = isSell ? 5 : 4;
      next[idx] = "saved";
      return next;
    });
    setActiveIdx(isSell ? 6 : 5);
  }, [isSell]);

  const resetForm = useCallback(() => {
    form.reset();
    setIsSuccess(false);
    setSectionStatus(["active", "pending", "pending", "pending", "pending", "pending"]);
    setActiveIdx(0);
  }, [form]);

  async function onSubmit() {
    const valid = await form.trigger();
    if (!valid) {
      const errors = form.formState.errors;
      const firstError = Object.values(errors)[0];
      const msg =
        firstError && "message" in firstError && firstError.message
          ? String(firstError.message)
          : "Please complete all required sections.";
      toast.error(msg);
      return;
    }

    const values = form.getValues();
    setIsSubmitting(true);

    try {
      if (isSell) {
        const body: CreateSellPropertyBody = {
          listingType: "sell",
          title: values.title,
          contact: values.contact,
          localityId: values.localityId,
          homeType: values.homeType as CreateSellPropertyBody["homeType"],
          apartmentName: values.apartmentName,
          bhk: values.bhk as CreateSellPropertyBody["bhk"],
          ownershipType: (values.ownershipType ?? "self") as "self" | "on_loan",
          builtUpArea: values.builtUpArea ?? 0,
          carpetArea: values.carpetArea ?? 0,
          propertyAge: values.propertyAge as CreateSellPropertyBody["propertyAge"],
          facing: values.facing,
          floorType: values.floorType,
          floorNumber: values.floorNumber,
          totalFloors: values.totalFloors,
          expectedPrice: values.expectedPrice ?? 0,
          availableFrom: values.availableFrom,
          maintenanceCost: values.maintenanceCost,
          description: values.description,
          kitchenType: values.kitchenType as CreateSellPropertyBody["kitchenType"],
          furnishedStatus: values.furnishedStatus as CreateSellPropertyBody["furnishedStatus"],
          parking: values.parking as CreateSellPropertyBody["parking"],
          bathrooms: values.bathrooms ?? 1,
          kitchens: values.kitchens ?? 1,
          whoShows: values.whoShows as CreateSellPropertyBody["whoShows"],
          currentStatus: values.currentStatus as CreateSellPropertyBody["currentStatus"],
          amenities: {
            gym: values.gym,
            powerBackup: values.powerBackup as "full" | "partial" | "none",
            gatedSociety: values.gatedSociety,
            clubHouse: values.clubHouse,
            lift: values.lift,
            intercom: values.intercom,
            shoppingCenter: values.shoppingCenter,
            sewageTreatment: values.sewageTreatment,
            gasPipeline: values.gasPipeline,
            swimmingPool: values.swimmingPool,
            fireSafety: values.fireSafety,
            childrenPlayArea: values.childrenPlayArea,
            park: values.park,
            visitorParking: values.visitorParking,
            internetServices: values.internetServices,
          },
          khataCertificate: values.khataCertificate as CreateSellPropertyBody["khataCertificate"],
          allotmentLetter: values.allotmentLetter as CreateSellPropertyBody["allotmentLetter"],
          saleDeedCertificate: values.saleDeedCertificate as CreateSellPropertyBody["saleDeedCertificate"],
          paidPropertyTax: values.paidPropertyTax as CreateSellPropertyBody["paidPropertyTax"],
          occupancyCertificate: values.occupancyCertificate as CreateSellPropertyBody["occupancyCertificate"],
          availabilityPeriod: values.availabilityPeriod as CreateSellPropertyBody["availabilityPeriod"],
          availabilityStartTime: values.availabilityStartTime,
          availabilityEndTime: values.availabilityEndTime,
        };
        await properties.create(body);
      } else {
        const body: CreateRentPropertyBody = {
          listingType: "rent",
          title: values.title,
          contact: values.contact,
          localityId: values.localityId,
          homeType: values.homeType as CreateRentPropertyBody["homeType"],
          bhk: values.bhk as CreateRentPropertyBody["bhk"],
          floorNumber: values.floorNumber,
          totalFloors: values.totalFloors,
          propertyAge: values.propertyAge,
          facing: values.facing,
          floorType: values.floorType,
          availableForLease: values.availableForLease ?? true,
          expectedRent: values.expectedRent ?? 0,
          expectedDeposit: values.expectedDeposit ?? 0,
          monthlyMaintenanceExtra: values.monthlyMaintenanceExtra ?? false,
          monthlyMaintenanceAmount: values.monthlyMaintenanceAmount,
          availableFrom: values.availableFrom,
          preferredTenants: values.preferredTenants ?? [],
          furnished: values.furnished ?? "unfurnished",
          parking: values.parking as CreateRentPropertyBody["parking"],
          description: values.description,
          bathrooms: values.bathrooms ?? 1,
          balcony: values.balcony ?? 0,
          waterSupply: values.waterSupply as CreateRentPropertyBody["waterSupply"],
          petAllowed: values.petAllowed,
          gym: values.gym,
          nonVegAllowed: values.nonVegAllowed,
          gatedSecurity: values.gatedSecurity,
          whoShows: values.whoShows as CreateRentPropertyBody["whoShows"],
          currentCondition: values.currentCondition as CreateRentPropertyBody["currentCondition"],
          directionDescription: values.directionDescription,
          amenities: {
            lift: values.lift,
            ac: values.ac,
            intercom: values.intercom,
            childrenPlayArea: values.childrenPlayArea,
            gasPipeline: values.gasPipeline,
            rainwaterHarvesting: values.rainwaterHarvesting,
            houseKeeping: values.houseKeeping,
            visitorParking: values.visitorParking,
            internetServices: values.internetServices,
            clubHouse: values.clubHouse,
            swimmingPool: values.swimmingPool,
            fireSafety: values.fireSafety,
            shoppingCenter: values.shoppingCenter,
            park: values.park,
            sewageTreatment: values.sewageTreatment,
            powerBackup: values.powerBackup === "full" || values.powerBackup === "partial",
            washingMachine: values.washingMachine,
            laundry: values.laundry,
          },
        };
        await properties.create(body);
      }

      toast.success("Property listed successfully!");
      setIsSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { error?: string } } };
      if (apiErr.response?.status === 401) {
        toast.error("Authentication required");
        return;
      }
      if (apiErr.response?.status === 403) {
        toast.error("Permission denied", {
          description: "Your account is not permitted to post listings.",
        });
        return;
      }
      const msg = apiErr.response?.data?.error ?? "Something went wrong. Please try again.";
      toast.error("Failed to post listing", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    isSell,
    listingType,
    homeType,
    monthlyMaintenanceExtra,
    sectionStatus,
    setSectionStatus,
    activeIdx,
    setActiveIdx,
    localityList,
    loadingLocalities,
    isSubmitting,
    isSuccess,
    isPending,
    saveSection,
    expandSection,
    markGallerySaved,
    resetForm,
    onSubmit,
    // Computed field lists (passed down to sections)
    section1Fields,
    section2Fields: getSection2Fields(isSell),
    section3Fields: isSell ? section3FieldsSell : section3FieldsRent,
    section4Fields,
    section5Fields: getSection5Fields(isSell),
  };
}