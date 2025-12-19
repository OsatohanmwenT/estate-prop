"use client";

import { useEffect } from "react";
import { AddPropertyForm } from "~/components/properties/add/AddPropertyForm";
import { usePropertyFormStore } from "~/stores/usePropertyFormStore";
import { Property } from "~/types/property";

interface EditPropertyWrapperProps {
  property: Property;
}

export function EditPropertyWrapper({ property }: EditPropertyWrapperProps) {
  const { initializeForEdit } = usePropertyFormStore();

  useEffect(() => {
    initializeForEdit(property.id, {
      propertyName: property.name,
      propertyType: property.category,
      street: property.address,
      city: property.city,
      state: property.state,
      area: property.lga || "",
      ownerId: property.ownerId,
      images: property.images || [],
      amenities: property.amenities || [],
      description: property.description || "",
    });
  }, [property]);

  return <AddPropertyForm />;
}
