import { useQuery } from "@tanstack/react-query";
import { tenantService } from "~/services";

export const useTenants = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["tenants", searchQuery || ""],
    queryFn: () =>
      tenantService.getAllTenants({ search: searchQuery, limit: 100 }),
  });
};
