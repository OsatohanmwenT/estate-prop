"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronRight,
  Image as ImageIcon,
  Lightbulb,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/contexts/AuthContext";
import { useAutosave } from "~/hooks/useAutosave";
import { useCreateProperty, useUpdateProperty } from "~/lib/query";
import { cn } from "~/lib/utils";
import { PropertySchema } from "~/schemas/propertyForm";
import {
  PropertyFormStep,
  usePropertyFormStore,
} from "~/stores/usePropertyFormStore";
import { CreatePropertyData, UpdatePropertyData } from "~/types/property";
import { PropertyCreatedDialog } from "./PropertyCreatedDialog";
import { AddressStep } from "./steps/AddressStep";
import { AmenitiesStep } from "./steps/AmenitiesStep";
import { GalleryStep } from "./steps/GalleryStep";

const STEPS: { id: PropertyFormStep; label: string; icon: any }[] = [
  { id: "address", label: "Details", icon: MapPin },
  { id: "amenities", label: "Amenities", icon: Lightbulb },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
];

interface PropertyFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  lga?: string;
  category: "residential" | "commercial" | "industrial" | "mixed_use";
  description?: string;
  ownerId: string;
  organizationId: string;
  amenities?: string[];
  images?: string[];
}

export function AddPropertyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdProperty, setCreatedProperty] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [savedData, setSavedData] = useState<PropertyFormData | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { currentStep, setStep, formData, isEditMode, propertyId, resetForm } =
    usePropertyFormStore();

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  const form: UseFormReturn<PropertyFormData> = useForm({
    resolver: zodResolver(PropertySchema),
    mode: "onSubmit",
    defaultValues: {
      name: formData.propertyName || "",
      address: formData.street || "",
      city: formData.city || "",
      state: formData.state || "",
      lga: formData.area || "",
      category: formData.propertyType || ("" as any),
      description: formData.description || "",
      ownerId: formData.ownerId || "",
      organizationId: user?.organizationId || "",
      amenities: formData.amenities || [],
      images: formData.images || [],
    },
  });

  const formValues = form.watch();
  const { clearSaved, loadSaved } = useAutosave({
    key: `property-form-draft-${user?.organizationId}`,
    data: formValues,
    enabled: !isEditMode && !isSubmitting,
    debounceMs: 2000,
  });

  // Sync store formData to react-hook-form when in edit mode
  useEffect(() => {
    if (isEditMode && formData.propertyName) {
      // Small delay to ensure form is ready
      const timer = setTimeout(() => {
        form.reset({
          name: formData.propertyName || "",
          address: formData.street || "",
          city: formData.city || "",
          state: formData.state || "",
          lga: formData.area || "",
          category: formData.propertyType || ("" as any),
          description: formData.description || "",
          ownerId: formData.ownerId || "",
          organizationId: user?.organizationId || "",
          amenities: formData.amenities || [],
          images: formData.images || [],
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isEditMode, formData]);

  useEffect(() => {
    if (isEditMode) return;
    const draft = loadSaved();
    if (draft && Object.keys(draft).length > 0 && draft.name) {
      setSavedData(draft);
      setShowRestoreDialog(true);
    }
  }, [isEditMode, loadSaved]);

  const handleRestoreDraft = () => {
    if (savedData) {
      form.reset(savedData);
      toast.success("Draft restored");
    }
    setShowRestoreDialog(false);
  };

  const handleDiscardDraft = () => {
    clearSaved();
    setShowRestoreDialog(false);
  };

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const getStepIndex = (step: PropertyFormStep): number =>
    STEPS.findIndex((s) => s.id === step);

  const currentStepIndex = getStepIndex(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!isLastStep) {
      setStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      router.push("/portfolio");
    } else {
      setStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    try {
      const payload: CreatePropertyData = {
        name: data.name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        lga: data.lga?.trim() || undefined,
        category: data.category,
        description: data.description?.trim() || undefined,
        ownerId: data.ownerId,
        organizationId: user?.organizationId || "",
        amenities: data.amenities?.length ? data.amenities : undefined,
        images: data.images?.length ? data.images : undefined,
      };

      if (isEditMode && propertyId) {
        const { organizationId, ...updatePayload } = payload;
        await updatePropertyMutation.mutateAsync({
          id: propertyId,
          data: updatePayload as UpdatePropertyData,
        });
        toast.success("Property updated successfully!");
        router.push(`/properties/${propertyId}`);
      } else {
        const newProperty = await createPropertyMutation.mutateAsync(payload);
        clearSaved();
        setCreatedProperty({
          id: newProperty.id,
          name: newProperty.name,
        });
        setShowSuccessDialog(true);
        resetForm();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(
        isEditMode
          ? `Failed to update property: ${message}`
          : `Failed to create property: ${message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillWithDummyData = () => {
    const dummyData = {
      name: "Sunset Residency",
      address: "123 Palm Avenue",
      city: "Lagos",
      state: "Lagos",
      lga: "Ikeja",
      category: "residential" as const,
      description: "Modern apartments with great ventilation.",
      amenities: ["Parking", "Security", "Water", "Power Backup"],
    };
    Object.entries(dummyData).forEach(([key, value]) => {
      form.setValue(key as keyof PropertyFormData, value);
    });
    toast.success("Dummy data filled");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "address":
        return (
          <AddressStep
            control={form.control as any}
            formState={form.formState}
          />
        );
      case "amenities":
        return (
          <AmenitiesStep
            control={form.control as any}
            watch={form.watch}
            setValue={form.setValue}
          />
        );
      case "gallery":
        return (
          <GalleryStep
            control={form.control as any}
            watch={form.watch}
            setValue={form.setValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white min-h-[600px] font-sans text-slate-900">
      {/* Visual Stepper - Linear Style */}
      <div className="border-b border-slate-100 px-6 py-6 bg-white">
        <div className="flex items-center max-w-4xl mx-auto relative justify-between">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative z-10 cursor-pointer group"
                onClick={() => setStep(step.id)}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 bg-white",
                    isActive
                      ? "border-slate-900 text-slate-900 ring-4 ring-slate-200"
                      : isCompleted
                        ? "border-emerald-500 text-emerald-600"
                        : "border-slate-400 text-slate-300 group-hover:border-slate-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon strokeWidth={1.5} className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "absolute -bottom-6 text-sm uppercase tracking-widest font-semibold whitespace-nowrap transition-colors",
                    isActive ? "text-slate-900" : "text-slate-700"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}

          {/* Background Line */}
          <div className="absolute top-4 left-0 w-full h-px bg-slate-100 -z-0" />

          {/* Progress Line */}
          <div
            className="absolute top-4 left-0 h-px bg-slate-900 transition-all duration-500 -z-0"
            style={{
              width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto h-full flex flex-col">
          {!isEditMode && (
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={fillWithDummyData}
                className="text-xs uppercase tracking-widest text-slate-600 hover:text-slate-900 h-6 px-2"
              >
                Auto-fill (Demo)
              </Button>
            </div>
          )}

          <form
            id="property-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 flex-1 flex flex-col"
          >
            <div className="flex-1 fade-in duration-500">
              {renderStepContent()}
            </div>
          </form>
        </div>
      </div>

      {/* Footer Navigation - Linear */}
      <div className="border-t border-slate-100 p-6 bg-white sticky bottom-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 rounded-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 uppercase tracking-wider text-sm font-semibold"
          >
            {isFirstStep ? "Cancel" : "Back"}
          </Button>

          <div className="flex gap-3">
            {isLastStep ? (
              <Button
                type="submit"
                form="property-form"
                disabled={isSubmitting}
                className="px-8 rounded-sm bg-slate-900 text-white hover:bg-slate-800 uppercase tracking-widest text-sm font-semibold h-10 shadow-none"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                    ? "Update Property"
                    : "Create Property"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={isSubmitting}
                className="px-8 rounded-sm border border-slate-200 bg-white text-slate-900 hover:border-slate-900 hover:bg-white transition-all uppercase tracking-widest text-sm font-semibold h-10 shadow-sm"
              >
                Next Step <ChevronRight className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {createdProperty && (
        <PropertyCreatedDialog
          open={showSuccessDialog}
          propertyId={createdProperty.id}
          propertyName={createdProperty.name}
        />
      )}

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent className="rounded-sm border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans text-lg font-semibold text-slate-900">
              Restore Draft?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-700">
              We found an unsaved property form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleDiscardDraft}
              className="rounded-sm border-slate-200 text-slate-700 uppercase tracking-wider text-sm"
            >
              Discard
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestoreDraft}
              className="rounded-sm bg-slate-900 text-white hover:bg-slate-800 uppercase tracking-wider text-sm"
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
