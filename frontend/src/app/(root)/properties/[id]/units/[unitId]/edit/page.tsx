import { notFound } from "next/navigation";
import MaxContainer from "~/components/shared/MaxContainer";
import { EditUnitWrapper } from "~/components/units/EditUnitWrapper";
import { unitService } from "~/services/unitService";

interface PageProps {
  params: Promise<{ id: string; unitId: string }>;
}

export default async function EditUnitPage({ params }: PageProps) {
  const { id, unitId } = await params;
  const propertyId = id;
  const uId = unitId;

  try {
    const unit = await unitService.getUnitById(propertyId, uId);

    if (!unit) {
      notFound();
    }

    return (
      <MaxContainer className="flex flex-col p-0 overflow-hidden h-[calc(100vh-4rem)]">
        <div className="p-6 border-b border-border bg-card">
          <h1 className="text-2xl font-semibold text-foreground">Edit Unit</h1>
          <p className="text-sm text-muted-foreground mt-1">{unit.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto bg-background">
          <EditUnitWrapper unit={unit} propertyId={propertyId} />
        </div>
      </MaxContainer>
    );
  } catch (error) {
    console.error("Failed to fetch unit for edit:", error);
    notFound();
  }
}
